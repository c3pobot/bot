'use strict'
const log = require('logger');
const k8s = require('@kubernetes/client-node');
const exchange = require('./exchange')
let NAME_SPACE = process.env.NAME_SPACE || 'default', SET_NAME = process.env.SET_NAME || 'bot', NUM_SHARDS = 0

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const appsApi = kc.makeApiClient(k8s.AppsV1Api);

const setFn = () => appsApi.listNamespacedStatefulSet(NAME_SPACE, undefined, undefined, undefined, undefined, `app=${SET_NAME}`)
const informer = k8s.makeInformer(kc, '/apis/apps/v1/statefulsets', setFn);
informer.on('error', (err) => {
    log.error(err);
    // Restart informer after 5sec
    setTimeout(() => {
        start();
    }, 5000);
});
informer.on('add', (set = {})=>{
  NUM_SHARDS = +(set?.spec.replicas || 0)
  exchange.send({ name: set?.metadata?.name, namespace: set?.metadata.namespace, replicas: set?.spec.replicas, type: 'statefulset', timestamp: Date.now() })
})
informer.on('update', (set = {})=>{
  NUM_SHARDS = +(set?.spec.replicas || 0)
  exchange.send({ name: set?.metadata?.name, namespace: set?.metadata.namespace, replicas: set?.spec.replicas, type: 'statefulset', timestamp: Date.now() })

  //rabbitmq.send(`statefulset.${data.namespace}.${data.name}`, data)
})
const start = async()=>{
  try{
    await informer.start()
    log.info(`${SET_NAME} informer started...`)
  }catch(err){
    if(err?.body?.message){
      log.error(`Code: ${err.body.code}, Msg: ${err.body.message}`)
    }else{
      log.error(err)
    }
    setTimeout(start, 5000)
  }
}
start()
module.exports.getNumShards = ()=>{
  return NUM_SHARDS
}
