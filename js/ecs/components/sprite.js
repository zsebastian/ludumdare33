ECS.registerComponent("Sprite", function (ret, img, size, texCoord)
{
    ret.img = img;
    ret.size = size;
    ret.texCoord = texCoord || [0, 0];
    return ret;
});

