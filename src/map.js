class Map {

  constructor(){};

  this.objects = [];
  this.usableObjects = [];

  addObject(Object)
  {
    if(Object.usable == true)
      {
        usableObjects.push(Object);
      }
    objects.push(Object);
  }

  getUsableObjects()
  {
    return usableObjects;
  }

}
