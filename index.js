var nowPlayingMusicId = 0;//记录当前正在播放的音乐id
var data;//所有音乐信息

const audio = document.getElementById('control');

function getMusicInfo() {//获取所有音乐信息
    const request = new XMLHttpRequest();
    request.open("GET", "getMusicInfo.php");
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200) {
            data = JSON.parse(request.responseText);
            //加载列表
            const list = document.getElementById("list-ol");
            let listRes = "";
            for (let i = 0; i < data.length; i++) {
                listRes += `
                <div class="list-item" id="music${data[i].id}" onclick ="loadMusicInfo(${data[i].id})">${data[i].title}\n-${data[i].author}</div>
                `;
            }
            list.innerHTML = listRes;
            //加载音乐
            loadMusicInfo(nowPlayingMusicId);
            //加载频谱
            draw();
        }
    };
    request.send(null);
}

getMusicInfo();

//控制音乐播放暂停按钮切换
audio.addEventListener("playing", function () {
    document.getElementById("play").style.display = 'none';
    document.getElementById("pause").style.display = 'flex';
});

audio.addEventListener("pause", function () {
    document.getElementById("play").style.display = 'flex';
    document.getElementById("pause").style.display = 'none';
});
//按钮功能
document.getElementById("play").addEventListener("click", function () {
    audio.play();
});
document.getElementById("pause").addEventListener("click", function () {
    audio.pause();
});
document.getElementById("backward-step").addEventListener("click", function () {
    loadMusicInfo(nowPlayingMusicId - 1);
});
document.getElementById("forward-step").addEventListener("click", function () {
    changeMusic();
});

//加载音乐
function loadMusicInfo(id) {
    if (id === -1) {
        id = data.length - 1; //指定id -1 为最后一首歌
    } else {
        id = Math.abs(id) % data.length; //防止id为负数和限制id不超出总歌曲数量
    }

    audio.pause();

    nowPlayingMusicId = id;//更新音乐id

    const address = "music/" + id + ".mp3";
    const cover = "cover/" + id + ".jpg";

    getMainColor(cover, function (mainColor) {//获取音乐封面主色调
        const str = mainColor;
        const regex = /[^,]+/g;
        const result = str.match(regex);
        const [r, g, b] = result;

        fr = 255 - r;
        fg = 255 - g;
        fb = 255 - b;

        const fMainColor = fr + "," + fg + "," + fb;

        document.getElementById("cover").style.boxShadow = "0px 0px 20px 0px rgba(" + mainColor + " ,0.5)";
        document.getElementById("progress").style.backgroundColor = "rgb(" + fMainColor + ")";
        document.getElementById("dot").style.backgroundColor = "rgb(" + fMainColor + ")";
        document.getElementById("lrcBox").style.color = "rgb(" + mainColor + ")";
        document.getElementById("lrcBox").style.textShadow = "0px 0px 5px rgb(" + fMainColor + ")";
        document.getElementById("showBox").style.backgroundColor = "rgba(" + mainColor + ",0.8)";
        for (let i = 0; i < document.getElementsByTagName("i").length; i++) {
            document.getElementsByTagName("i")[i].style.setProperty("--iconHoverColor", "rgb(" + mainColor + ")");
            document.getElementsByTagName("i")[i].style.setProperty("--iconColor", "rgb(" + fMainColor + ")");
            document.getElementsByTagName("i")[i].style.textShadow = "0px 0px 10px rgba(" + mainColor + " ,0.5)";
        }
        for (let i = 0; i < document.getElementsByClassName("list-item").length; i++) {
            document.getElementsByClassName("list-item")[i].style.setProperty("--iconHoverColor", "rgba(" + mainColor + ",0.5)");
            document.getElementsByClassName("list-item")[i].style.setProperty("--iconColor", "rgb(" + fMainColor + ")");
        }
        document.getElementById("volume-progress").style.backgroundColor = "rgb(" + fMainColor + ")";
        document.getElementById("volume-dot").style.backgroundColor = "rgb(" + fMainColor + ")";
    });
    //清空音乐信息滚动状态
    document.getElementById("title").setAttribute("class", "");
    document.getElementById("author").setAttribute("class", "");
    document.getElementById("album").setAttribute("class", "");
    //清空音乐选择状态
    for (let i = 0; i < data.length; i++) {
        document.getElementById("music" + i).setAttribute("class", "list-item");
    }
    //加载信息
    document.getElementById("music" + id).setAttribute("class", "list-item playing-item");
    document.getElementById("box").style.backgroundImage = "url(" + cover + ")";
    document.getElementById("list").style.backgroundImage = "url(" + cover + ")";
    document.getElementById("title").innerHTML = data[id].title;
    document.getElementById("cover").style.backgroundImage = "url(" + cover + ")";
    document.getElementById("author").innerHTML = data[id].author;
    if (data[id].album == null) {
        document.getElementById("album").innerHTML = "暂无专辑";
    } else {
        document.getElementById("album").innerHTML = data[id].album;
    }
    document.getElementById("audio").src = address;
    //播放音乐
    audio.load();
    audio.play();
    //添加音乐信息滚动状态
    if (document.getElementById("title").clientWidth > 150) {
        document.getElementById("title").setAttribute("class", "scrolling-text");
        document.getElementById("title").innerHTML = data[id].title + "\n\n" + data[id].title;
    }
    if (document.getElementById("album").clientWidth > 150) {
        document.getElementById("album").setAttribute("class", "scrolling-text");
        document.getElementById("album").innerHTML = data[id].album + "\n\n" + data[id].album;
    }
    if (document.getElementById("author").clientWidth > 150) {
        document.getElementById("author").setAttribute("class", "scrolling-text");
        document.getElementById("author").innerHTML = data[id].author + "\n\n" + data[id].author;
    }
    //加载歌词
    getLrc(nowPlayingMusicId);
    //立刻更新进度条
    showTextProgress();
    changeProgress();
}

//更新进度条
setInterval(() => {
    showTextProgress();
    changeProgress();
}, 1000);

//显示文本进度
function showTextProgress() {
    const totalSeconds = Math.floor(audio.duration);
    const seconds = Math.floor(audio.currentTime);
    const totalProgress = s_To_mmss(totalSeconds);
    const progress = s_To_mmss(seconds);
    const result = progress + "/" + totalProgress;
    document.getElementById("textProgress").innerHTML = result;
}
//显示进度条进度
function getProgressPercentage() {
    const totalSeconds = audio.duration;
    const seconds = audio.currentTime;
    const res = ((seconds / totalSeconds) * 100) + "%";
    return res;
}
//更改进度
function changeProgress() {
    const percentage = getProgressPercentage();
    document.getElementById("progress").style.setProperty("--progress", percentage);
    document.getElementById("dot").style.setProperty("--progress", percentage);
}
//秒转换为分秒显示
function s_To_mmss(ts) {
    const m = Math.floor(ts / 60);
    const s = ts % 60;
    const mm = addZero(m);
    const ss = addZero(s);
    const result = mm + ":" + ss;
    return result;
}

function addZero(a) {
    a < 10 ? a = "0" + a : a
    return a
}

//封面旋转
audio.addEventListener("playing", startRotateCover);
audio.addEventListener("pause", stopRotateCover);
let isRotating = false; // 用于判断盒子是否正在旋转
let rotationAngle = 0; // 用于存储当前旋转角度

function startRotateCover() {
    if (!isRotating) {
        isRotating = true;
        requestAnimationFrame(rotate);
    }
}

function rotate() {
    const cover = document.getElementById('cover');
    rotationAngle += 0.2;
    cover.style.transform = `rotate(${rotationAngle}deg)`;

    if (isRotating) {
        requestAnimationFrame(rotate);
    }
}

function stopRotateCover() {
    isRotating = false;
    rotationAngle = 0;
    const cover = document.getElementById('cover');
    cover.style.transform = 'rotate(0deg)';
}

//鼠标悬浮进度条出现小圆点
document.getElementById("progress-bar").addEventListener("mouseover", function () {
    document.getElementById("dot").style.display = "flex";
})
document.getElementById("progress-bar").addEventListener("mouseout", function () {
    document.getElementById("dot").style.display = "none";
})

//进度条行为
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const dot = document.getElementById('dot');

let isMouseDown = false;
let audioDuration = isNaN(audio.duration) ? 0 : audio.duration;
let currentPercentage = 0;

// 鼠标按下
function handleMouseDown(e) {
    isMouseDown = true;
    updateProgressAndAudio(e);
}

// 鼠标松开
function handleMouseUp(e) {
    isMouseDown = false;
    updateProgressAndAudio(e);
}

// 鼠标移动
function handleMouseMove(e) {
    if (isMouseDown) {
        updateProgressAndAudio(e);
    }
}

function updateProgressAndAudio(e) {
    const progressBarRect = progressBar.getBoundingClientRect();
    const clickX = e.clientX;
    const clickY = e.clientY;

    if (
        clickX >= progressBarRect.left &&
        clickX <= progressBarRect.right &&
        clickY >= progressBarRect.top &&
        clickY <= progressBarRect.bottom
    ) {
        const percentage = (clickX - progressBarRect.left) / progressBarRect.width;

        const validPercentage = Math.max(0, Math.min(1, percentage));

        progress.style.width = `${validPercentage * 100}%`;
        dot.style.left = `${validPercentage * 100}%`;

        if (!isMouseDown) { //md不知道为啥这个判断里的代码放下面的判断不起作用
            progress.style.removeProperty("width");
            dot.style.removeProperty("left");
            showTextProgress();
            changeProgress();
        }

        if (!isMouseDown && audio.readyState >= 4) {
            const audioCurrentTime = audioDuration * validPercentage;
            audio.currentTime = audioCurrentTime;
        }
    }
}

progressBar.addEventListener('mousedown', handleMouseDown);
progressBar.addEventListener('mouseup', handleMouseUp);
progressBar.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);

audio.addEventListener('loadedmetadata', function () {
    audioDuration = isNaN(audio.duration) ? 0 : audio.duration;
});

//获取图片主色调
function getMainColor(imgUrl, callback) {
    var img = new Image();
    img.crossOrigin = '';
    img.src = imgUrl;

    img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;

        var colorCounts = {};
        var maxCount = 0;
        var mainColor;

        for (var i = 0; i < pixels.length; i += 4) {
            var r = pixels[i];
            var g = pixels[i + 1];
            var b = pixels[i + 2];
            var rgb = r + "," + g + "," + b;

            if (colorCounts[rgb]) {
                colorCounts[rgb]++;
            } else {
                colorCounts[rgb] = 1;
            }

            if (colorCounts[rgb] > maxCount) {
                maxCount = colorCounts[rgb];
                mainColor = rgb;
            }
        }
        callback(mainColor);
    };
}

//展开&收起列表
var isListShow = false //记录列表展开状态

document.getElementById("bars").addEventListener("click", toggleList)

function toggleList() {
    if (isListShow) {
        isListShow = !isListShow
        document.getElementById("list").style.height = "0px";
    } else {
        isListShow = !isListShow
        document.getElementById("list").style.height = "300px";
    }
}

//展开&收起播放器
var isPlayerShow = false

document.getElementById("showBox").addEventListener("click", togglePlayer)

function togglePlayer() {
    if (isPlayerShow) {
        isPlayerShow = !isPlayerShow
        document.getElementById("musicPlayer").style.right = "-350px";
        document.getElementById("showBoxIcon").style.transform = "rotate(180deg)"
    } else {
        isPlayerShow = !isPlayerShow
        document.getElementById("musicPlayer").style.right = "0px";
        document.getElementById("showBoxIcon").style.transform = "rotate(0deg)"
    }
}

//歌词

//获取歌词文件
function getLrc(id) {
    const request = new XMLHttpRequest();
    request.open('GET', 'lrc/' + id + '.lrc', true);
    request.responseType = 'text';
    request.overrideMimeType('text/plain; charset=utf-8');
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            const lyricsText = request.responseText;
            lyricsData = parseLyrics(lyricsText);
        }
    };
    request.send();
}

const lyricsBox = document.getElementById('lrcBox');
let lyricsData = []; // 存储歌词数据的数组

// 解析歌词文本并将歌词数据存入数组
function parseLyrics(lyricsText) {
    const lines = lyricsText.split('\n');
    const lyricsData = [];
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2})\]/;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const timeMatches = line.match(timeRegex);
        if (timeMatches) {
            const minutes = parseInt(timeMatches[1]);
            const seconds = parseInt(timeMatches[2]);
            const milliseconds = parseInt(timeMatches[3]);
            const time = minutes * 60 + seconds + milliseconds / 100;
            const text = line.replace(timeRegex, '').trim();
            if (text) {
                lyricsData.push({ time, text });
            }
        }
    }
    return lyricsData;
}

// 监听音乐的时间更新事件
audio.addEventListener('timeupdate', function () {
    const currentTime = audio.currentTime;
    let currentLyrics = '';
    for (let i = 0; i < lyricsData.length; i++) {
        if (currentTime >= lyricsData[i].time) {
            currentLyrics = lyricsData[i].text;
        } else {
            break;
        }
    }
    lyricsBox.innerHTML = currentLyrics;
});

audio.addEventListener('loadstart', () => {
    lyricsBox.innerHTML = "歌曲加载中,请稍候..."
})

//音频频谱

const canvas = document.getElementById('visualizer');

const audioContext = new (window.AudioContext || window.AudioContext)();
const analyser = audioContext.createAnalyser();

const source = audioContext.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 128;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const canvasCtx = canvas.getContext('2d');

function draw() {
    getMainColor("cover/" + nowPlayingMusicId + ".jpg", function (mainColor) {//获取音乐封面主色调
        const str = mainColor;
        const regex = /[^,]+/g;
        const result = str.match(regex);
        const [r, g, b] = result;

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i];

            canvasCtx.fillStyle = `rgb(${255 - r},${255 - g},${255 - b},${(barHeight / 255) * 100}%)`;
            canvasCtx.fillRect(x, canvas.height - barHeight / 12, barWidth, barHeight / 12);

            x += barWidth + 1;
        }

        requestAnimationFrame(draw);
    });
}

function getRandomMusicId(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let id = Math.floor(Math.random() * (max - min + 1)) + min;
    if (id === nowPlayingMusicId) {
        id = getRandomMusicId(min, max);//如果随机到同一首歌再随机一次;
    }
    return id;
}

let endedMode = "loop" //播放模式 next顺序播放 random随机播放 loop单曲循环

//播完自动下一首

function changeMusic() {
    switch (endedMode) {
        case "next":
            loadMusicInfo(nowPlayingMusicId + 1);
            break;
        case "random":
            loadMusicInfo(getRandomMusicId(0, data.length - 1));
            break;
        case "loop":
            audio.currentTime = 0;
            audio.play();
            changeProgress();
            showTextProgress();
            break;
        default:
            break;
    }
}

audio.addEventListener("ended", changeMusic);

toggleChangeEndedMode()

document.getElementById("repeat").addEventListener("click", toggleChangeEndedMode);
document.getElementById("shuffle").addEventListener("click", toggleChangeEndedMode);
document.getElementById("repeat-1").addEventListener("click", toggleChangeEndedMode);

function toggleChangeEndedMode() {
    const repeat = document.getElementById("repeat");
    const repeat_1 = document.getElementById("repeat-1");
    const shuffle = document.getElementById("shuffle");
    switch (endedMode) {
        case "next":
            endedMode = "random"
            repeat.style.display = "none";
            shuffle.style.display = "flex"
            break;
        case "random":
            endedMode = "loop"
            shuffle.style.display = "none"
            repeat_1.style.display = "flex";
            break
        case "loop":
            endedMode = "next"
            repeat_1.style.display = "none";
            repeat.style.display = "flex";
            break
        default:
            break;
    }
}

let isVolumeSliderShow = false;

function toggleVolumeSlider() {
    isVolumeSliderShow = !isVolumeSliderShow;
    if (isVolumeSliderShow) {
        document.getElementById("slider").style.height = "100px";
        document.getElementById("slider").style.marginTop = "-110px"
        document.getElementById("slider").style.marginBottom = "10px"
    } else {
        document.getElementById("slider").style.height = "0px";
        document.getElementById("slider").style.marginTop = "0px"
        document.getElementById("slider").style.marginBottom = "0px"
    }
}

audio.addEventListener("volumechange", () => {
    if (audio.volume === 0) {
        document.getElementById("volumeIcon").setAttribute("class", "fa-solid fa-volume-xmark icon");
    } else {
        document.getElementById("volumeIcon").setAttribute("class", "fa-solid fa-volume-up icon")
    }
})

document.getElementById("volumeIcon").addEventListener("click", toggleVolumeSlider);

//鼠标悬浮进度条出现小圆点
document.getElementById("slider").addEventListener("mouseover", function () {
    document.getElementById("volume-dot").style.display = "flex";
})
document.getElementById("slider").addEventListener("mouseout", function () {
    document.getElementById("volume-dot").style.display = "none";
})

//进度条行为
const volumeSlider = document.getElementById('slider');
const volumeProgress = document.getElementById('volume-progress');
const volumeDot = document.getElementById('volume-dot');

audio.volume = 0.5;
let nowVolume = 0.5;//默认音量

volumeProgress.style.height = `${nowVolume * 100}%`;
volumeDot.style.bottom = `${(nowVolume * 100) - 4}%`;

// 鼠标按下
function volumeHandleMouseDown(e) {
    isMouseDown = true;
    updateVolumeProgress(e);
}

// 鼠标松开
function volumeHandleMouseUp(e) {
    isMouseDown = false;
    updateVolumeProgress(e);
}

// 鼠标移动
function volumeHandleMouseMove(e) {
    if (isMouseDown) {
        updateVolumeProgress(e);
    }
}

function updateVolumeProgress(e) {
    const volumeSliderRect = volumeSlider.getBoundingClientRect();
    const clickX = e.clientX;
    const clickY = e.clientY;

    if (
        clickX >= volumeSliderRect.left &&
        clickX <= volumeSliderRect.right &&
        clickY >= volumeSliderRect.top &&
        clickY <= volumeSliderRect.bottom
    ) {
        const percentage = 1 - (clickY - volumeSliderRect.top) / volumeSliderRect.height;
        const validPercentage = Math.max(0, Math.min(1, percentage));

        volumeProgress.style.height = `${validPercentage * 100}%`;
        volumeDot.style.bottom = `${(validPercentage * 100) - 4}%`;

        audio.volume = validPercentage;
    }
}

volumeSlider.addEventListener('mousedown', volumeHandleMouseDown);
volumeSlider.addEventListener('mouseup', volumeHandleMouseUp);
volumeSlider.addEventListener('mousemove', volumeHandleMouseMove);
document.addEventListener('mouseup', volumeHandleMouseUp);

audio.addEventListener('loadedmetadata', function () {
    nowVolume = audio.volume;
});