function unauthorized(){return new Response('Unauthorized',{status:401})}
export async function onRequest({request,env}){
  if(!env.REVIEWS_DB) return Response.json({error:'Database binding is not configured.'},{status:500});
  const auth=request.headers.get('Authorization')||'';
  if(!env.ADMIN_TOKEN || auth!==`Bearer ${env.ADMIN_TOKEN}`) return unauthorized();

  if(request.method==='GET'){
    const {results}=await env.REVIEWS_DB.prepare(
      `SELECT id, book_slug, reviewer_name, rating, review_text, status, moderation_reason, created_at
       FROM reviews WHERE status='pending' ORDER BY datetime(created_at) ASC, id ASC`
    ).all();
    return Response.json({reviews:results||[]});
  }
  if(request.method==='POST'){
    let body;try{body=await request.json()}catch{return Response.json({error:'Invalid JSON'},{status:400})}
    const id=Number(body.id), action=body.action;
    if(!Number.isInteger(id)||!['approved','rejected'].includes(action))
      return Response.json({error:'Invalid action'},{status:400});
    await env.REVIEWS_DB.prepare('UPDATE reviews SET status=? WHERE id=?').bind(action,id).run();
    return Response.json({ok:true,status:action});
  }
  return new Response('Method not allowed',{status:405});
}
