const {
    pipe,
    map,
    filter,
    groupBy,
    forEach,
    length,
    pluck,
    reduce,
    divide,
    complement,
    isNil,
    add,
    ifElse,
    curry,
    view,
    lensProp,
    indexBy,
    chain,
    merge,
    props,
    prop,
  } = require('ramda');
  const {
    calculateDateDiff
  } = require('./date-helper')
  
  // 상수
  const CALL_CATCHER_TYPE = 'IT03';
  const DEFAULT_FINISH_YN = 'N';
  
  // const pipe = R.pipe;
  // const map = R.map;
  // const filter = R.filter;
  // const groupBy = R.groupBy;
  // const forEach = R.forEach;
  // const length = R.length;
  // const pluck = R.pluck;
  // const reduce = R.reduce;
  // const divide = R.divide;
  // const complement = R.complement;
  // const isNil = R.isNil;
  // const add = R.add;
  // const ifElse = R.ifElse;
  // const curry = R.curry;
  
  // 공통
  const isNotNil = complement(isNil);
  const sum = reduce(add, 0);
  
  const isUse = data => data.USE_YN === 'Y';
  const filterUse = filter(isUse);
  const isFinish = data => data.FINISH_YN === 'Y';
  const filterFinish = filter(isFinish);
  
  const notExistTbCallback = data => !data.CALL_NUMBER;
  const filterNotExistTbCallback = filter(notExistTbCallback);
  
  const get = curry((propName, data) => view(lensProp(propName), data));
  
  // 콜캐처 관련 GET 함수
  const getCallCatcherData = get('CALL_CATCHER_DATA');
  const getCallCatcherTypeData = get('CALL_CATCHER_TYPE_DATA');
  const getRoutingPointInfoData = get('ROUTING_POINT_INFO_DATA');
  
  const getAbandonCallData = get('ABANDON_CALL_DATA');
  const getSiteCallCatcherTypeData = get('SITE_CALL_CATCHER_TYPE_DATA');
  const getSiteRoutingPointInfoData = get('SITE_ROUTING_POINT_INFO_DATA');
  const getSiteData = get('SITE_DATA');
  
  // 콜백 관련 GET 함수
  const getCallbackData = get('CALLBACK_DATA');
  
  // const getInCount = data => length(data);
  const getInCount = length;
  const getFinishCount = pipe(
    filterFinish,
    length,
  );
  const getProcessLeadTime = data =>
    data.FINISH_YN === 'Y' ? calculateDateDiff(data.FINISH_DATETIME, data.IN_DATETIME) : '';
  
  const dataLengthNotZero = data => length(data) > 0;
  
  const innerJoin = curry((f1, f2, t1, t2) => {
    const indexed = indexBy(f1, t1);
    return chain(t2row => {
      const corresponding = indexed[f2(t2row)];
      return corresponding ? [merge(t2row, corresponding)] : [];
    }, t2);
  });
  
  const rightJoin = curry((mapper1, mapper2, t1, t2) => {
    const indexed = indexBy(mapper1, t1);
    return t2.map(t2row => merge(t2row, indexed[mapper2(t2row)]));
  });
  
  const leftJoin = curry((f1, f2, t1, t2) => rightJoin(f2, f1, t2, t1));
  
  const joinKeyTenantKeyAndRoutingPoint = props(['TENANT_KEY', 'ROUTING_POINT']);
  // [2019-09-18] added for DNIS
  const joinKeySiteCdAndEndpointDn = props(['SITE_CD', 'ENDPOINT_DN']);
  const joinKeySiteCdAndCause = props(['SITE_CD', 'CAUSE']);
  const joinKeySiteCd = prop(['SITE_CD']);
  const joinKeyCallID = prop(['CALLID']);
  
  const innerJoinOnTenantKeyAndRoutingPoint = curry((tblA, tblB) =>
    innerJoin(joinKeyTenantKeyAndRoutingPoint, joinKeyTenantKeyAndRoutingPoint, tblA, tblB),
  );
  // [2019-09-18] added for DNIS
  const innerJoinOnSiteCdAndEndpointDn = curry((tblA, tblB) =>
    innerJoin(joinKeySiteCdAndEndpointDn, joinKeySiteCdAndEndpointDn, tblA, tblB),
  );
  const innerJoinOnSiteCdAndCause = curry((tblA, tblB) =>
    innerJoin(joinKeySiteCdAndCause, joinKeySiteCdAndCause, tblA, tblB),
  );
  const innerJoinOnSiteCd = curry((tblA, tblB) => innerJoin(joinKeySiteCd, joinKeySiteCd, tblA, tblB));
  
  const leftJoinOnCallID = curry((tblA, tblB) => leftJoin(joinKeyCallID, joinKeyCallID, tblA, tblB));
  
  const extractData = data => {
    const IN_DATE = data.END_TIME.split(' ')[0].replace(/-/g, '');
    const IN_TIME = data.END_TIME.split(' ')[1].replace(/:/g, '');
    const IN_DATETIME = IN_DATE + IN_TIME;
    // [2019-09-18] added for DNIS
    return [
      data.SITE_CD,
      IN_DATE,
      IN_TIME,
      IN_DATETIME,
      data.CALLID,
      data.CALLER || '',
      data.CALLER || '',
      data.ENDPOINT_DN || '',
      data.DNIS || '',
      CALL_CATCHER_TYPE,
      data.CAUSE,
      DEFAULT_FINISH_YN,
    ];
  };
  
  const extractCallbackData = data => [
    data.ROW_DATE,
    data.SITE_CD,
    data.IN_TYPE,
    data.IN_DETAIL_TYPE,
    data.IN_COUNT,
    data.FINISH_COUNT,
    data.AVERAGE_PROCESS_LEAD_TIME,
    data.AVERAGE_PROCESS_TRY_COUNT,
  ];
  
  const generateCallCatcherRowData = map(extractData);
  const generateCallbackRowData = map(extractCallbackData);
  
  module.exports = {
    filter,
    groupBy,
    forEach,
    length,
    pluck,
    reduce,
    sum,
    divide,
    pipe,
    ifElse,
    curry,
    map,
    filterFinish,
    filterUse,
    filterNotExistTbCallback,
    innerJoinOnTenantKeyAndRoutingPoint,
    innerJoinOnSiteCdAndEndpointDn,
    innerJoinOnSiteCdAndCause,
    innerJoinOnSiteCd,
    leftJoinOnCallID,
    generateCallCatcherRowData,
    generateCallbackRowData,
    getCallCatcherData,
    getCallCatcherTypeData,
    getRoutingPointInfoData,
    getAbandonCallData,
    getSiteCallCatcherTypeData,
    getSiteRoutingPointInfoData,
    getSiteData,
    getCallbackData,
    dataLengthNotZero,
  };
  