/**
 * Created by yuanjianxin on 2018/5/10.
 */
const Koa=require('koa');
const KoaBody=require('koa-body');
const KoaRouter=require('koa-router')();
const Utils=require('yue-helper').Utils;
const generateService=require('yue-service');
const app=new Koa();

module.exports=class App{

    constructor(){
        this.bodyConf={}; //koa-body configs
        this.serivceConf=null;
        this.middlewareConf=null;
        this.routesConf=null;
        this.port=process.env.APP_PORT || 3000;
    }

    set Routes(routesConf){
        this.routesConf=routesConf;
    }

    set Middleware(middlewareConf){
        this.middlewareConf=middlewareConf;
    }

    set Body(bodyConf){
        this.bodyConf=bodyConf;
    }

    set Service(serviceConf){
        this.serivceConf=serviceConf;
    }

    set Port(port){
        this.port=port;
    }

    run(){

        const middlewares=Utils.generateMiddlewareFuncs(this.middlewareConf);
        Utils.generateRoutes(KoaRouter,this.routesConf);
        let bodyConf=this.bodyConf || {};

        // use koa-body
        app.use(KoaBody(bodyConf));

        //use middlewares
        middlewares.forEach(v=>{
            app.use(v);
        });

        // use service
        let serviceConf=this.serivceConf;
        app.use(generateService(serviceConf || {}));

        // use routes
        app.use(KoaRouter.routes());

        // listen on port
        app.listen(this.port);

    }

}