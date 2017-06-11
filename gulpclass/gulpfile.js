var gulp=require("gulp");
var uglifyjs=require("gulp-uglify");   //压缩js文件
var uglifycss=require("gulp-minify-css");   //压缩css文件
var uglifyhtml=require("gulp-htmlmin");   //压缩html文件
var concat=require("gulp-concat");   //合并
var sass=require("gulp-sass");  //sass编译
var webserver=require("gulp-webserver");   //web服务热启动
var browserify=require("gulp-browserify");   //模块化的打包
var renames=require("gulp-rename");   // 文件重命名
var imagemin=require("gulp-imagemin");   //图片的压缩
var url=require("url");
//js文件压缩
gulp.task("jsmin",function(){
	gulp.src('src/js/*.js')
	    .pipe(browserify({
	    	insertGlobals:true,
	    	debug: !gulp.env.production
	    }))
	    .pipe(uglifyjs())
	    .pipe(gulp.dest('bound/js'))
})
//html文件压缩
gulp.task("htmlmin",function(){
	gulp.src('src/html/*.html')
	    .pipe(uglifyhtml({collapseWhitespace:true}))
	    .pipe(gulp.dest('bound/html'))
})
//css文件压缩
gulp.task("cssmin",function(){
	gulp.src('src/css/*.css')
	    .pipe(uglifycss())
	    .pipe(renames("renamescommon.css"))
	    .pipe(gulp.dest('bound/css'))
})
//文件合并
gulp.task("concats",function(){
	gulp.src('src/js/*.js')
	    .pipe(concat('concat.js'))
	    .pipe(gulp.dest('src/js'))
})
//sass编译
gulp.task("bianyi",function(){
	gulp.src('src/css/index.sass')
	    .pipe(sass())
	    .pipe(gulp.dest('bound/css'))
})
//web服务热启动
gulp.task('server',["htmlmin","jsmin","cssmin","bianyi"],function(){
	gulp.watch("./src/html/index.html",["htmlmin"])    //必须要监听才能实现实时更新
	gulp.watch("./src/css/index.sass",["cssmin"])
	gulp.src('./bound')
	    .pipe(webserver({
             livereload:true,
             directoryListing:true,
             middleware:function(req,res,next){
             	//res请求头是模拟的后台数据返回告诉浏览器返回数据头，没有头的话数据出不来
             	var data={
	             	address:"beijing"
	             }
	             console.log(req.url)
             	res.writeHead(200,{
             		"Content-type":"application/json;charset=UTF-8",
             		"Access-Control-Allow-Origin":"*"   //允许所有主机进行请求
             	})
             	res.write(JSON.stringify(data));
             	res.end();   //有开头有结尾不然数据依然无返回
             },
             open:"/html/index.html"
	    }))
})