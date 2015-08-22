ECS.Component("Sprite", function (ret, img, size, texCoord, mirror)
{
    ret.img = img;
    ret.size = size;
    ret.texCoord = texCoord || [0, 0];
    ret.mirror = mirror || false;
    return ret;
});

