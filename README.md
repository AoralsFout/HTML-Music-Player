# HTML-Music-Player

 基于html+css+javascript+php+sql
 使用了fontawesome6图标库

![image](https://raw.githubusercontent.com/AoralsFout/HTML-Music-Player/main/sc-1.gif)

 demo:https://www.aoralsfout.cn/music

### 数据库👇

```sql
CREATE TABLE `musics` (
  `id` int(255) NOT NULL DEFAULT '0',
  `title` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `album` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `author` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `musics` (`id`, `title`, `address`, `cover`, `lrc`, `album`, `author`) VALUES
	(0, '2009-2020动漫单曲', NULL, '暮肆_Mousse')

```

### 功能

播放时旋转封面

上一首/下一首切换

音量控制

时长控制

播放模式 : 单曲循环 顺序播放 随机播放

音频频谱特效

处理lrc歌词文件

主体侧边隐藏/展开

封面主题色背景

### 添加歌曲

在mysql数据库里musics表里新增一条数据,包含id,歌的标题(title),作者(author),专辑(album)(专辑可以null,前端显示暂无专辑)
在music,lrc,cover这三个文件夹中分别加入id.mp3,id.lrc,id.cover三个文件(音频,歌词,封面),要和数据库的id对应上,歌词文件必须是UTF-8编码,否则显示歌词会出现乱码
