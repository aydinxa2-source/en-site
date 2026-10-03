import Arena from '@/app/arena';
import { notFound } from 'next/navigation';
export default async function RoomPage({params}:{params:Promise<{room:string}>}){const {room}=await params;if(!['gol','serbest','kart','faul'].includes(room))notFound();return <Arena initialRoom={room}/>}
