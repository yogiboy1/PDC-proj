function manipulateImage(type,ctx,canvas) {
    var a, b, g, i, imageData, j, length, pixel, r, ref;
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Hint! This is where you should post messages to the web worker and
    // receive messages from the web worker.

    length = imageData.data.length / 4;
    for (i = j = 0, ref = length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        r = imageData.data[i * 4 + 0];
        g = imageData.data[i * 4 + 1];
        b = imageData.data[i * 4 + 2];
        a = imageData.data[i * 4 + 3];
        pixel = manipulate(type, r, g, b, a);
        imageData.data[i * 4 + 0] = pixel[0];
        imageData.data[i * 4 + 1] = pixel[1];
        imageData.data[i * 4 + 2] = pixel[2];
        imageData.data[i * 4 + 3] = pixel[3];
    }
    return ctx.putImageData(imageData, 0, 0);
}