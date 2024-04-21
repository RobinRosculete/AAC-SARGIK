using System;
namespace server.DTOs;
	public class BoundingBoxDTO
	{

	//Uri Coresponding to image
	public int imageID{ get; set; }

    //Coordointes of Bounding Box
    public float xMin { get; set; }
    public float yMin { get; set; }
    public float xMax { get; set; }
    public float yMax { get; set; }

    //Label of object in Bounding Box
    public string label { get; set; }

    //Message for text to speech feature
    public string message { get; set; }

}


