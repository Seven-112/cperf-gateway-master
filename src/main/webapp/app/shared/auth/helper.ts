import store from 'app/config/full-accessible-store';
import { Privilege } from 'app/entities/privilege/custom/privilege';
import { PrivilegeAction } from '../model/enumerations/privilege-action.model';
import { IPrivilege } from '../model/privilege.model';
import { IRootState } from '../reducers';
import {
  ALL_PRIVILIGES_ENTITY,
  PRIVILEGE_ACTIONS_SEPARATOR,
  PRIVILEGE_FIELDS_SEPARATOR,
  PRIVILEGE_STRING_PREFIX,
} from '../util/constantes';

export interface IAuthPrivileges {
  entities: string[];
  actions: string[];
}

export const extractAuthorities = (authorirites?: string[]): string[] => {
  const stateAuthorities = authorirites && authorirites.length !== 0 ? authorirites : store.getState().authentication.account.authorities;
  if (stateAuthorities && stateAuthorities.length > 0) {
    return stateAuthorities.filter(authority => !authority.startsWith(PRIVILEGE_STRING_PREFIX));
  }
  return [];
};

export const extratPrivileges = (authorirites?: string[]): IPrivilege[] => {
  const stateAuthorities = authorirites && authorirites.length !== 0 ? authorirites : store.getState().authentication.account.authorities;
  if (stateAuthorities && stateAuthorities.length > 0) {
    return stateAuthorities
      .filter(authority => authority.startsWith(PRIVILEGE_STRING_PREFIX))
      .map(authority => {
        const split = authority.substring(PRIVILEGE_STRING_PREFIX.length).split(PRIVILEGE_FIELDS_SEPARATOR);
        const privilege: IPrivilege = {};
        if (split && split.length > 0) {
          for (let i = 0; i < split.length; i++) {
            if (i === 0) privilege.id = Number(split[i]);
            else if (i === 1) privilege.authority = split[i];
            else if (i === 2) privilege.entity = split[i];
            else if (i === 3) privilege.action = split[i];
            else privilege.constrained = split[i] && split[i].toLocaleLowerCase() === 'true' ? true : false;
          }
        }
        return privilege;
      });
  }
  return [];
};

export const hasAuthorities = (authorities: string[], globalAuthotities?: string[]) => {
  const stateAuthorities =
    globalAuthotities && globalAuthotities.length !== 0 ? globalAuthotities : store.getState().authentication.account.authorities;
  return extractAuthorities(stateAuthorities).some(authority => authorities.includes(authority));
};

export const hasAction = (privilege: IPrivilege, actions: string[]) => {
  if (privilege.action) {
    if (!privilege.action.includes(PrivilegeAction.ALL) && !actions.some(action => action === PrivilegeAction.ALL)) {
      const split = privilege.action.split(PRIVILEGE_ACTIONS_SEPARATOR);
      if (split && split.length !== 0) return split.some(action => actions.includes(action));
      return actions.includes(privilege.action);
    }
    return true;
  }
  return false;
};

export const hasPrivileges = (authPrivilges: IAuthPrivileges, globalAuthotities?: string[]) => {
  const stateAuthorities =
    globalAuthotities && globalAuthotities.length !== 0 ? globalAuthotities : store.getState().authentication.account.authorities;
  return extratPrivileges(stateAuthorities).some(
    privilege =>
      (privilege.entity && privilege.entity.toLocaleLowerCase().includes(ALL_PRIVILIGES_ENTITY.toLocaleLowerCase())) ||
      (authPrivilges.entities.includes(privilege.entity) && hasAction(privilege, authPrivilges.actions))
  );
};
