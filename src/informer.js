'use strict'
const path = require('path')
const log = require('logger')
const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);

const NAME_SPACE = process.env.POD_NAMESPACE
const BOT_SET_NAME = process.env.BOT_SET_NAME || 'bot'
const POD_NAME = process.env.POD_NAME

const listFn = () => k8sAppsApi.listNamespacedStatefulSet(NAME_SPACE);
const informer = k8s.makeInformer(kc, path.join('/apis/apps/v1/namespaces', NAME_SPACE, 'statefulsets'), listFn);

informer.on('error', (err) => {
    log.error(err);
    // Restart informer after 5sec
    setTimeout(() => {
        startInformer();
    }, 5000);
});
const startInformer = async()=>{
  try{
    await informer.start()
    log.info(`${POD_NAME} informer started`)
  }catch(err){
    if(err?.body?.message){
      log.error(`Code: ${err.body.code}, Msg: ${err.body.message}`)
    }else{
      log.error(err)
    }
    setTimeout(startInformer, 5000)
  }
}
startInformer()
module.exports = informer
