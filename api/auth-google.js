export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).end();
  const {email,sub}=req.body||{};
  return res.json({ok:true,got:{email,sub}});
}
