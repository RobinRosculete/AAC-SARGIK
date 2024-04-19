using System;
namespace server.DTOs;
	public class BoundingBoxDTO
	{

	//Uri Coresponding to image
	public int imageID{ get; set; }

    //Coordointes of Bounding Box
    public int xMin { get; set; }
    public int yMin { get; set; }
    public int xMax { get; set; }
    public int yMax { get; set; }

    //Label of object in Bounding Box
    public string label { get; set; }

    //Message for text to speech feature
    public string message { get; set; }

}


