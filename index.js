var nowPlayingMusicId = 0;//记录当前正在播放的音乐id
var data;//所有音乐信息

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
                `
            }
            list.innerHTML = listRes;
            //加载音乐
            loadMusicInfo(nowPlayingMusicId);
        }
    }
    request.send(null);
}

getMusicInfo();

//控制音乐播放暂停按钮切换
document.getElementById("control").addEventListener("playing", function () {
    document.getElementById("play").style.display = 'none';
    document.getElementById("pause").style.display = 'flex';
})

document.getElementById("control").addEventListener("pause", function () {
    document.getElementById("play").style.display = 'flex';
    document.getElementById("pause").style.display = 'none';
})
//按钮功能
document.getElementById("play").addEventListener("click", function () {
    document.getElementById("control").play();
})
document.getElementById("pause").addEventListener("click", function () {
    document.getElementById("control").pause();
})
//播完自动下一首
// document.getElementById("control").addEventListener("waiting", loadMusicInfo(nowPlayingMusicId + 1));

//加载音乐
function loadMusicInfo(id) {
    nowPlayingMusicId = id;//更新音乐id
    getMainColor(data[id].cover, function (mainColor) {//获取音乐封面主色调
        document.getElementById("cover").style.boxShadow = "0px 0px 20px 0px rgba(" + mainColor + " ,0.5)"
        document.getElementById("progress").style.backgroundColor = "rgb(" + mainColor + ")";
        document.getElementById("dot").style.backgroundColor = "rgb(" + mainColor + ")";
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
    document.getElementById("box").style.backgroundImage = "url(" + data[id].cover + ")";
    document.getElementById("list").style.backgroundImage = "url(" + data[id].cover + ")";
    document.getElementById("title").innerHTML = data[id].title;
    document.getElementById("cover").style.backgroundImage = "url(" + data[id].cover + ")";
    document.getElementById("author").innerHTML = data[id].author;
    if (data[id].album == null) {
        document.getElementById("album").innerHTML = "暂无专辑"
    } else {
        document.getElementById("album").innerHTML = data[id].album;
    }
    document.getElementById("audio").src = data[id].address;
    //播放音乐
    document.getElementById("control").load()
    document.getElementById("control").play()
    //添加音乐信息滚动状态
    if (document.getElementById("title").clientWidth > 150) {
        document.getElementById("title").setAttribute("class", "scrolling-text")
        document.getElementById("title").innerHTML = data[id].title + "\n\n" + data[id].title
    }
    if (document.getElementById("album").clientWidth > 150) {
        document.getElementById("album").setAttribute("class", "scrolling-text")
        document.getElementById("album").innerHTML = data[id].album + "\n\n" + data[id].album
    }
    if (document.getElementById("author").clientWidth > 150) {
        document.getElementById("author").setAttribute("class", "scrolling-text")
        document.getElementById("author").innerHTML = data[id].author + "\n\n" + data[id].author
    }
    //加载歌词
    getLrc(nowPlayingMusicId);
}

//更新进度条
setInterval(() => {
    showTextProgress();
    changeProgress();
}, 1000);
//显示文本进度
function showTextProgress() {
    const totalSeconds = Math.floor(document.getElementById("control").duration);
    const seconds = Math.floor(document.getElementById("control").currentTime);
    const totalProgress = s_To_mmss(totalSeconds);
    const progress = s_To_mmss(seconds);
    const result = progress + "/" + totalProgress;
    document.getElementById("textProgress").innerHTML = result;
}
//显示进度条进度
function getProgressPercentage() {
    const totalSeconds = document.getElementById("control").duration;
    const seconds = document.getElementById("control").currentTime;
    const res = ((seconds / totalSeconds) * 100) + "%"
    return res
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
document.getElementById("control").addEventListener("playing", startRotateCover);
document.getElementById("control").addEventListener("pause", stopRotateCover);
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

//点击进度条跳转
document.getElementById("progress-bar").addEventListener("click", function (e) {
    const clickX = e.clientX;
    const offX = this.offsetLeft;
    const x = clickX - offX;
    if (x < 0) {//防止出现负数
        x = 0
    }
    const width = this.offsetWidth;
    const percentage = x / width;
    const totalSeconds = document.getElementById("control").duration;
    const seconds = totalSeconds * percentage;
    document.getElementById("control").currentTime = seconds;
    showTextProgress();
    changeProgress();
})
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

const audio = document.getElementById('control');
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

