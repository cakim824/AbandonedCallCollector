const { clone } = require('ramda');

const {
  AbandonCall,
  CallCatcher,
  Site,
  SiteCallCatcherType,
  SiteRoutingPointInfo,
  SiteRPVQInfo,
} = require('../models');

const {
  innerJoinOnTenantKeyAndRoutingPoint,
  innerJoinOnSiteCdAndEndpointDn,
  innerJoinOnSiteCdAndCause,
  innerJoinOnSiteCd,
  generateCallCatcherRowData,
  filterUse,
} = require('../utils/msg');

const {
  convertDateFormat,
  setTimestamp,
} = require('../utils/date-helper');

const log = require('../utils/logger');

const read = (start_timestamp, end_timestamp) =>
  new Promise(async (resolve, reject) => {
    try {
      log.info('[call-catcher] read start: start_timestamp=' + setTimestamp(start_timestamp).format('YYYYMMDDHHmmss') + ', end_timestamp=' + setTimestamp(end_timestamp).format('YYYYMMDDHHmmss'));
      const abandon_call_data = await AbandonCall.find(start_timestamp, end_timestamp);
      const site_call_catcher_type_data = await SiteCallCatcherType.find();
      const site_routing_point_info_data = await SiteRoutingPointInfo.find();
      const site_data = await Site.find();
      const last_apply_date_site = await SiteRPVQInfo.findLastApplyed();
      log.debug('[call-catcher] abandon_call_data: ' + JSON.stringify(abandon_call_data));
      log.debug('[call-catcher] site_call_catcher_type_data: ' + JSON.stringify(site_call_catcher_type_data));
      log.debug('[call-catcher] site_routing_point_info_data: ' + JSON.stringify(site_routing_point_info_data));
      log.debug('[call-catcher] site_data: ' + JSON.stringify(site_data));
      log.debug('[call-catcher] last_apply_date_site: ' + JSON.stringify(last_apply_date_site));
      resolve(
        clone({
          abandon_call_data,
          site_call_catcher_type_data,
          site_routing_point_info_data,
          site_data,
          last_apply_date_site,
        })
      )
    } catch (error) {
      reject(error);
    }
  }
)

const process = datas => 
new Promise((resolve, reject) => {
  log.info('[call-catcher] process start');
  try {
    const {
      abandon_call_data,
      site_call_catcher_type_data,
      site_routing_point_info_data,
      site_data,
      last_apply_date_site,
    } = datas;
    const filtered_site_call_catcher_type_data = filterUse(site_call_catcher_type_data);
    log.debug('[call-catcher] filtered_site_call_catcher_type_data: ' + JSON.stringify(filtered_site_call_catcher_type_data));
    const tenant_key_added_site_routing_point_data = innerJoinOnSiteCd(site_data, site_routing_point_info_data);
    log.debug('[call-catcher] tenant_key_added_site_routing_point_data: ' + JSON.stringify(tenant_key_added_site_routing_point_data));
    const site_cd_added_abandon_call_data = innerJoinOnTenantKeyAndRoutingPoint(
      tenant_key_added_site_routing_point_data,
      abandon_call_data,
    );
    log.debug('[call-catcher] site_cd_added_abandon_call_data: ' + JSON.stringify(site_cd_added_abandon_call_data));

    const dnis_added_abandon_call_data = innerJoinOnSiteCdAndEndpointDn(
      site_cd_added_abandon_call_data,
      last_apply_date_site,
    );
    log.debug('[call-catcher] dnis_added_abandon_call_data: ' + JSON.stringify(dnis_added_abandon_call_data));

    const filtered_site_cd_added_abandon_call_data = innerJoinOnSiteCdAndCause(
      filtered_site_call_catcher_type_data,
      dnis_added_abandon_call_data,
    );
    log.debug('[call-catcher] filtered_site_cd_added_abandon_call_data: ' + JSON.stringify(filtered_site_cd_added_abandon_call_data));
    const generated_call_catcher_row_data = generateCallCatcherRowData(filtered_site_cd_added_abandon_call_data);
    log.debug('[call-catcher] generated_call_catcher_row_data: ' + JSON.stringify(generated_call_catcher_row_data));
    resolve(clone(generated_call_catcher_row_data));
  } catch (error) {
    reject(error);
  }
})

const write = call_catcher_data => 
new Promise(async (resolve, reject) => {
  try {
    log.info('[call-catcher] write start');
    const write_result = await CallCatcher.create(call_catcher_data);
    log.debug('[call-catcher] write_result: ' + JSON.stringify(write_result));
    resolve(clone(write_result));
  } catch (error) {
    reject(error);
  }
})

const main = async (start_timestamp, end_timestamp) => {
  try {
    log.info('call-catcher job main start');
    const data = await read(start_timestamp, end_timestamp);
    const processed_data = await process(clone(data));
    const write_result = await write(clone(processed_data));
    
    return clone(write_result);
  } catch (error) {
    throw error;
  }
};

module.exports = main;
