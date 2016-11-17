var vrbar = function()
{
}

room.date;
vrbar.end = 0;
length = 1000;
doorMoving = false;
doorCounter = -1;
open = "false";

room.onLoad = function()
{
	var doorPos = Vector(3.6, .2, 9.1);
	vrbar.createDoor(doorPos);
}

room.update = function(delta_time)
{
	room.date = new Date();
	vrbar.openDoor();
	
	if(room.objects["isDoorOpen"].text != open)
	{
		vrbar.clickOpposite();
	}
	
}

vrbar.createDoor = function(doorPos)
{
	room.objects["isDoorOpen"].text = "false";
		room.objects["door2"].id = "door";
	room.objects["door2"].pos.x = doorPos.x - 1.422;
	room.objects["door2"].pos.y = doorPos.y;
	room.objects["door2"].pos.z = doorPos.z;
	room.objects["door2"].onclick = "vrbar.clickOpposite()";
	room.objects["door2"].collision_id = "doorx";
	
	
	room.objects["door1"].id = "door";
	room.objects["door1"].pos.x = doorPos.x + 1.422;
	room.objects["door1"].pos.y = doorPos.y;
	room.objects["door1"].pos.z = doorPos.z;	
	room.objects["door1"].onclick = "vrbar.clickOpposite()"
	room.objects["door1"].collision_id = "doorx";
	room.objects["door1"].xdir = Vector(1,0,0);
	room.objects["door1"].ydir = Vector(0,1,0);
	room.objects["door1"].zdir = Vector(0,0,1);
}

vrbar.clickOpposite = function()
{

	if( open == "false" && doorMoving == false)
	{
		open = "true";
		room.objects["isDoorOpen"].text = "true"
		room.playSound('aud_door_open');
		vrbar.end = room.date.valueOf() + length;
		
	}
	else if(open == "true" && doorMoving == false)
	{
		open = "false";
		room.objects["isDoorOpen"].text = "false"
		room.playSound("aud_door_close");
		vrbar.end = room.date.valueOf() + length;
	}
	room.objects["isDoorOpen"].sync = true;
}

vrbar.openDoor = function()
{	
	var doorCounter = vrbar.end - room.date.valueOf();
	if(doorCounter > 0 && open == "true")
	{
		doorMoving = true;
		room.objects["door1"].xdir.x = Math.sin(doorCounter/(length/(6.28/4)));
		room.objects["door1"].xdir.z = Math.cos(doorCounter/(length/(6.28/4)));
		
		room.objects["door1"].zdir.x = room.objects["door1"].xdir.z * -1;
		room.objects["door1"].zdir.z = room.objects["door1"].xdir.x;
		
		room.objects["door2"].xdir.x = Math.sin(-1 * doorCounter/(length/(6.28/4)));
		room.objects["door2"].xdir.z = Math.cos(-1 * doorCounter/(length/(6.28/4)));
	
		room.objects["door2"].zdir.x = room.objects["door2"].xdir.z * -1;
		room.objects["door2"].zdir.z = room.objects["door2"].xdir.x;
	}
	else if(doorCounter > 0 && open == "false")
	{
		var closeDoorCounter = length - doorCounter;
		doorMoving = true;
		room.objects["door1"].xdir.x = Math.sin(closeDoorCounter/(length/(6.28/4)));
		room.objects["door1"].xdir.z = Math.cos(closeDoorCounter/(length/(6.28/4)));
	
		room.objects["door1"].zdir.x = room.objects["door1"].xdir.z * -1;
		room.objects["door1"].zdir.z = room.objects["door1"].xdir.x;
		
		room.objects["door2"].xdir.x = Math.sin(-1 * closeDoorCounter/(length/(6.28/4)));
		room.objects["door2"].xdir.z = Math.cos(-1 * closeDoorCounter/(length/(6.28/4)));
	
		room.objects["door2"].zdir.x = room.objects["door2"].xdir.z * -1;
		room.objects["door2"].zdir.z = room.objects["door2"].xdir.x;
	}
	else
	{
		doorMoving = false;
	}
}
