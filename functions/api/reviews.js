function json(data,status=200){return Response.json(data,{status,headers:{'cache-control':'no-store'}})}
function clean(v,max){return String(v??'').trim().slice(0,max)}

export async function onRequestPost({request,env}){
  if(!env.REVIEWS_DB) return json({error:'Database binding is not configured.'},500);
  let body;
  try{body=await request.json()}catch{return json({error:'Invalid submission.'},400)}

  const book_slug=clean(body.book,160);
  const reviewer_name=clean(body.name,80);
  const review_text=clean(body.review,2000);
  const rating=Number(body.rating);
  const honeypot=clean(body.website,200);
  if(honeypot) return json({status:'rejected'},201);
  if(!book_slug || reviewer_name.length<2 || review_text.length<10 || !Number.isInteger(rating) || rating<1 || rating>5)
    return json({error:'Please provide a valid name, rating, and review.'},400);

  // Lightweight duplicate protection without storing a visitor's raw IP address.
  const fingerprintSource=`${book_slug}|${reviewer_name.toLowerCase()}|${review_text.toLowerCase()}`;
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(fingerprintSource));
  const fingerprint=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
  const existing=await env.REVIEWS_DB.prepare(
    'SELECT id FROM reviews WHERE book_slug=? AND reviewer_name=? AND review_text=? LIMIT 1'
  ).bind(book_slug,reviewer_name,review_text).first();
  if(existing) return json({error:'This review was already submitted.'},409);

  // Hash the connecting IP before storage; never store the raw address.
  const ip=request.headers.get('CF-Connecting-IP')||'';
  let ip_hash=null;
  if(ip){
    const ipDigest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip));
    ip_hash=Array.from(new Uint8Array(ipDigest)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  await env.REVIEWS_DB.prepare(
    `INSERT INTO reviews (book_slug, reviewer_name, rating, review_text, status, ip_hash)
     VALUES (?, ?, ?, ?, 'pending', ?)`
  ).bind(book_slug,reviewer_name,rating,review_text,ip_hash).run();

  return json({status:'pending',message:'Thank you! Your review was received and will be published after moderation.'},201);
}

export async function onRequestGet({request,env}){
  if(!env.REVIEWS_DB) return json({error:'Database binding is not configured.'},500);
  const url=new URL(request.url);
  const book=clean(url.searchParams.get('book'),160);
  let statement;
  if(book){
    statement=env.REVIEWS_DB.prepare(
      `SELECT reviewer_name, rating, review_text, created_at
       FROM reviews WHERE status='approved' AND book_slug=? ORDER BY datetime(created_at) DESC, id DESC`
    ).bind(book);
  }else{
    statement=env.REVIEWS_DB.prepare(
      `SELECT book_slug, reviewer_name, rating, review_text, created_at
       FROM reviews WHERE status='approved' ORDER BY datetime(created_at) DESC, id DESC`
    );
  }
  const {results}=await statement.all();
  return json({reviews:results||[]});
}
