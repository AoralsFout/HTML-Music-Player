# HTML-Music-Player
 A html music player

###数据库结构👇

```sql
CREATE TABLE `musics` (
  `id` int(255) NOT NULL DEFAULT '0',
  `title` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `address` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cover` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lrc` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `album` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `author` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `musics` (`id`, `title`, `address`, `cover`, `lrc`, `album`, `author`) VALUES
	(0, '2009-2020动漫单曲', 'music/0.mp3', 'cover/0.jpg', 'lrc/0.lrc', NULL, '暮肆_Mousse'),
	(1, 'Flower of Life', 'music/1.mp3', 'cover/1.jpg', 'lrc/1.lrc', '"Flower of Life" The best selection 2008-2011', '陽花'),
	(2, 'LEVEL5 -judgelight-', 'music/2.mp3', 'cover/2.jpg', 'lrc/2.lrc', 'とある科学の超楽曲集 (TV动画《某科学的超电磁炮》精选集 科学之超乐曲集)', 'fripSide (フリップサイド)');

```
