import store from './full-accessible-store';

export const enum SetupService {
  GATEWAY = 'microgateway',
  OBJECTIF = 'objectif',
  PROCESS = 'microprocess',
  PROJECT = 'microproject',
  RISK = 'microrisque',
  PARTENER = 'micropartener',
  PROVIDER = 'microprovider', // module pour la gestion des fournisseurs
  QMANAGER = 'qmanager',
  FILEMANAGER = 'microfilemanager',
  AGENDA = 'microagenda',
  STOCK = 'microstock',
  AUDIT = 'audit',
  QUERY_PONCTUAL = 'punctual_query',
}

const isOnline = (service: SetupService) => {
  const modules = store.getState().appUtils.modules;
  return modules.map(m => m.toLowerCase()).includes(service.toLowerCase());
};

export const serviceIsOnline = (service: SetupService) => {
  // query ponctual include in query manager
  if (service.toLowerCase() === SetupService.QUERY_PONCTUAL.toLowerCase()) return isOnline(service) && isOnline(SetupService.QMANAGER);

  // audits inculdes in microrisque
  if (service.toLowerCase() === SetupService.AUDIT.toLowerCase()) return isOnline(service) && isOnline(SetupService.RISK);

  return isOnline(service);
};
