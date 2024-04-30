
const { exec } = require('child_process');
const chokidar = require('chokidar');
const bServer = require('browser-sync').create();
const chalk = require('chalk');

// 监听 JS 编译配置
const watcher = chokidar.watch(['./src/origin/'], {
    persistent: true,
    ignored: /(^|[/\\])\../, // 忽略隐藏文件
    ignoreInitial: true, // 忽略初始化时的变化
});

// 处理 JS 编译文件
watcher.on('change', (path) => {
  let pathArr = path.split('\\');
  let fileName = pathArr[pathArr.length - 1];
  let dir = path.split('src\\origin')[1].split('\\' + fileName)[0].replace(/\\/g, '/');
  dir = dir.length > 1 ? dir : '';

  exec(`npx babel ${path} -o ./src/target${dir}/${fileName}`, (error) => {
    if (error) {
      console.error(chalk.red(`编译失败: ${error.message}`));
    } else {
      console.log(chalk.green(`编译成功`));
    }
  });
});


bServer.init({
	server: {
		baseDir: './'
	},
	files: [
    './**/*.html',
    './**/*.css',
    './**/*.js'
  ],
  ignore: [
    'node_modules/**/*.*',
    'src/origin/**/*.*',
    'dist/**/*.*'
  ],
	port: 2305,
	open: false,
	notify: false
});