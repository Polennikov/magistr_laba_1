let imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);
let canvas = document.getElementById('imageCanvas');
let ctx = canvas.getContext('2d');
function handleImage(e){
    let reader = new FileReader();
    reader.onload = function(event){
        let img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}


function getImage(canvas){
    let imageData = canvas.toDataURL();
    let image = new Image();
    image.src = imageData;
    return image;
}

function saveImage(image) {
    let link = document.createElement("a");

    link.setAttribute("href", image.src);
    link.setAttribute("download", "canvasImage");
    link.click();
}

function saveCanvasAsImageFile(){
    let image = getImage(document.getElementById("imageCanvas"));
    saveImage(image);
}
//функция фильтра негатив
function negativeFilter(){
    let imageDatas = document.getElementById("imageCanvas").toDataURL();
    let img = new Image();
    img.src = imageDatas;
    img.onload = function() {
        // создаем или находим canvas
        let canvas = document.getElementById('imageCanvas');
        // получаем его 2D контекст
        let ctx = canvas.getContext('2d');
        // помещаем изображение в контекст
        ctx.drawImage(img, 0, 0);
        // получаем объект, описывающий внутреннее состояние области контекста
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        //чистим область
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // фильтруем
        imageDataFiltered = sepia(imageData);
        // кладем результат фильтрации обратно в canvas
        ctx.putImageData(imageDataFiltered, 0, 0);
    }

    sepia = function (imageData) {
        // получаем одномерный массив, описывающий все пиксели изображения
        let pixels = imageData.data;
        // циклически преобразуем массив, изменяя значения красного, зеленого и синего каналов
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            pixels[i]     =255-( (r * 0.393)+(g * 0.769)+(b * 0.189)); // red
            pixels[i + 1] =255-( (r * 0.349)+(g * 0.686)+(b * 0.168)); // green
            pixels[i + 2] =255-( (r * 0.272)+(g * 0.534)+(b * 0.131)); // blue
        }
        return imageData;
    };
}

function function_blur(){
    let imageDatas = document.getElementById("imageCanvas").toDataURL();
    let oImg = new Image();
    oImg.src = imageDatas;
    let canvas = document.getElementById('imageCanvas');
    let ctx = canvas.getContext('2d');
    let oData,newSrc;
    ctx.drawImage(oImg,0,0,canvas.width,canvas.height);
    oData = ctx.getImageData(0,0,canvas.width,canvas.height);
    newSrc = gaussBlur(oData);
    ctx.putImageData(newSrc, 0, 0);


    function gaussBlur(imgData){
        let pixes = imgData.data;
        let width = imgData.width;
        let height = imgData.height;
        let gaussMatrix = [],
            gaussSum = 0,
            x, y,
            r, g, b, a,
            i, j, k, len;

        let radius = 10;
        let sigma = 5;

        a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
        b = -1 / (2 * sigma * sigma);
        // Генерируем гауссову матрицу
        for (i = 0, x = -radius; x <= radius; x++, i++){
            g = a * Math.exp(b * x * x);
            gaussMatrix[i] = g;
            gaussSum += g;

        }
        // Нормализация, чтобы убедиться, что значение гауссовой матрицы находится в пределах [0,1]
        for (i = 0, len = gaussMatrix.length; i < len; i++) {
            gaussMatrix[i] /= gaussSum;
        }
        // Одномерная гауссовская операция в направлении x
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                r = g = b = a = 0;
                gaussSum = 0;
                for(j = -radius; j <= radius; j++){
                    k = x + j;
                    if (k >= 0 && k <width) {// Убедитесь, что k не превышает диапазон x
                        // r, g, b, группа из четырех человек
                        i = (y * width + k) * 4;
                        r += pixes[i] * gaussMatrix[j + radius];
                        g += pixes[i + 1] * gaussMatrix[j + radius];
                        b += pixes[i + 2] * gaussMatrix[j + radius];
                        // a += pixes[i + 3] * gaussMatrix[j];
                        gaussSum += gaussMatrix[j + radius];
                    }
                }
                i = (y * width + x) * 4;
                // Делим на gaussSum для устранения пикселей по краю, проблема недостаточного гауссова расчета
                pixes[i] = r / gaussSum;
                pixes[i + 1] = g / gaussSum;
                pixes[i + 2] = b / gaussSum;
            }
        }
        // Одномерная гауссовская операция в направлении y
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                r = g = b = a = 0;
                gaussSum = 0;
                for(j = -radius; j <= radius; j++){
                    k = y + j;
                    if (k >= 0 && k <height) {// Убедитесь, что k не превышает диапазон y
                        i = (k * width + x) * 4;
                        r += pixes[i] * gaussMatrix[j + radius];
                        g += pixes[i + 1] * gaussMatrix[j + radius];
                        b += pixes[i + 2] * gaussMatrix[j + radius];
                        // a += pixes[i + 3] * gaussMatrix[j];
                        gaussSum += gaussMatrix[j + radius];
                    }
                }
                i = (y * width + x) * 4;
                pixes[i] = r / gaussSum;
                pixes[i + 1] = g / gaussSum;
                pixes[i + 2] = b / gaussSum;
            }
        }
        return imgData;
    }
}

function grayFilter() {
    let imageDatas = document.getElementById("imageCanvas").toDataURL();
    let img = new Image();
    img.src = imageDatas;
    img.onload = function() {
        let canvas = document.getElementById('imageCanvas');
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        let imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        imageDataFiltered = gray(imgPixels);
        ctx.putImageData(imageDataFiltered, 0, 0);
    }

    function gray(imgPixels) {
        for(let y = 0; y < imgPixels.height; y++){
            for(let x = 0; x < imgPixels.width; x++){
                let i = (y * 4) * imgPixels.width + x * 4;
                let avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                imgPixels.data[i] = avg;
                imgPixels.data[i + 1] = avg;
                imgPixels.data[i + 2] = avg;
            }
        }
        return imgPixels;
    }
}
