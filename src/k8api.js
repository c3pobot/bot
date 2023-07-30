'use strict'
const SET_NAME = process.env.SET_NAME || 'bot'
const NAMESPACE = process.env.POD_NAMESPACE
const POD_NAME = process.env.POD_NAME
const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);
const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
module.exports.getNumShards = async()=>{
  try{
    if(!SET_NAME || !NAMESPACE) throw('k8 info not provided...')
    let replicas = await k8sAppsApi.readNamespacedStatefulSet(SET_NAME, NAMESPACE)
    return (replicas?.body?.spec?.replicas)
  }catch(e){
    throw(e)
  }
}
module.exports.getShardNum = async()=>{
  try{
    if(!POD_NAME || !SET_NAME || !NAMESPACE) throw('k8 info not provided...')
    let pod = await k8sCoreApi.readNamespacedPod(POD_NAME, NAMESPACE)
    if(!pod?.body?.metadata?.generateName) return
    let shardNum = POD_NAME?.replace(pod?.body?.metadata?.generateName, '')
    let replicas = await k8sAppsApi.readNamespacedStatefulSet(SET_NAME, NAMESPACE)
    if(+shardNum >= 0 && replicas?.body?.spec?.replicas) return { totalShards: +replicas.body.spec.replicas, shardNum: +shardNum }
  }catch(e){
    throw(e)
  }
}
