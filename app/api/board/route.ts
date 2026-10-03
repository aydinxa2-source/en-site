import { board, db, identity } from '@/lib/server';
import { designSchema, toEmbed } from '@/lib/catalog';
import { z } from 'zod';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store'};
export async function GET(){try{return Response.json(await board(),{headers})}catch(e){console.error('Board load failed',e);return Response.json({error:'Saha yüklenemedi. Lütfen yeniden deneyin.'},{status:503,headers})}}
function fail(error:string,status=400){return Response.json({error},{status,headers})}
export async function POST(request:Request){try{
 if(request.headers.get('origin')!==new URL(request.url).origin)return fail('İstek doğrulanamadı.',403);
 if(!request.headers.get('content-type')?.includes('application/json'))return fail('Geçersiz istek.',415);
 const user=await identity();if(!user)return fail('Devam etmek için giriş yapın.',401);
 const raw=await request.text();if(raw.length>120000)return fail('İstek çok büyük.',413);const data=JSON.parse(raw);
 if(data.action==='vote'){
 const id=z.string().regex(/^(gol|serbest|kart|faul)-(?:[1-9]|1[0-3])$/).parse(data.id);
 await db().prepare('INSERT OR IGNORE INTO members(id,email,name) VALUES(?,?,?)').bind(user.id,user.email,user.name).run();
 const r=await db().prepare("INSERT OR IGNORE INTO votes(user_id,room,clip_id) SELECT ?,room,id FROM clips WHERE id=? AND embed<>''").bind(user.id,id).run();if(!r.meta.changes)return fail('Bu odada oyunuzu zaten kullandınız veya video artık mevcut değil.',409);
 }else if(data.action==='clip'){
 if(user.role==='member')return fail('Bu işlem için editör yetkisi gerekir.',403);
 const d=z.object({id:z.string().regex(/^(gol|serbest|kart|faul)-(?:[1-9]|1[0-3])$/),title:z.string().trim().min(2).max(140),url:z.string().max(500),previousEmbed:z.string().max(500)}).parse(data);
 const embed=toEmbed(d.url);if(embed===null)return fail('Geçerli bir HTTPS YouTube veya Vimeo bağlantısı girin.');
 const result=await db().prepare('UPDATE clips SET title=?,embed=? WHERE id=? AND embed=? AND (embed=? OR NOT EXISTS(SELECT 1 FROM votes WHERE clip_id=clips.id))').bind(d.title,embed,d.id,d.previousEmbed,embed).run();if(!result.meta.changes)return fail('Oy almış videonun bağlantısı değiştirilemez veya kayıt başka bir editör tarafından değiştirildi. Sayfayı yenileyin.',409);
 }else if(data.action==='design'){
 if(user.role!=='owner')return fail('Bu işlem yalnızca site sahibine açık.',403);
 const design=designSchema.parse(data.design),version=z.number().int().positive().parse(data.version);const r=await db().prepare('UPDATE settings SET value=?,version=version+1 WHERE id=1 AND version=?').bind(JSON.stringify(design),version).run();if(!r.meta.changes)return fail('Görünüm başka bir oturumda güncellendi. Yenileyip tekrar deneyin.',409);
 }else if(data.action==='editor'){
 if(user.role!=='owner')return fail('Yetki yönetimi yalnızca site sahibine açık.',403);
 const email=z.string().trim().email().max(254).parse(data.email).toLowerCase();if(email===user.email)return fail('Site sahibinin yetkisi değiştirilemez.');const add=z.boolean().parse(data.add);await db().prepare(add?'INSERT OR IGNORE INTO editors(email) VALUES(?)':'DELETE FROM editors WHERE email=?').bind(email).run();
 }else return fail('İşlem bulunamadı.');
 return Response.json(await board(),{headers});
 }catch(e){if(e instanceof z.ZodError||e instanceof SyntaxError)return fail('Alanları kontrol edin.');console.error('Board action failed',e);return fail('İşlem tamamlanamadı. Değişikliklerinizi koruyup yeniden deneyin.',503)}}
