const Koa = require('koa');
const path = require('path'); 
const router = require('koa-router')()
const app = new Koa();
// ==== environment set ====
app.context.isProd = process.env.NODE_ENV == 'production';
// app.context.isProd = false; // debug

// ==== static files ====
const static_max_age = 1000*3600*24*365;
const static = require('koa-static');
app.use(static(path.join(__dirname , './statics'), {maxage: static_max_age}));

// 定义路由  
router.get('/', async (ctx) => {  
  // 设置响应类型为 HTML  
  ctx.type = 'html';  ``
  // 读取静态 HTML 文件的内容  
  const htmlContent = fs.readFileSync(path.join(__dirname, './statics', 'index.html'), 'utf8');  
  // 将内容作为响应体返回  
  ctx.body = htmlContent;  
}); 
app.use(router.routes())


// ===== api =======
app.listen(8080);
console.log('app started at port 8080...');