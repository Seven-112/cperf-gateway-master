package com.mshz.service;

import java.util.List;
import java.util.stream.Collectors;

import com.mshz.domain.Privilege;
import com.mshz.repository.PrivilegeRepository;
import com.mshz.security.MySecurityConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CustomPermissionEvalutor {

    private final PrivilegeRepository privilegeRepository;

    private final Logger log = LoggerFactory.getLogger(CustomPermissionEvalutor.class);

    public CustomPermissionEvalutor(PrivilegeRepository privilegeRepository){
        this.privilegeRepository = privilegeRepository;
    }

    public boolean hasPermission(String entity, String action){
        List<Privilege> privileges = extractPrivileges().stream()
                .filter(pv -> (pv.getEntity() !=null && pv.getEntity().equalsIgnoreCase(entity)) 
                        || pv.getAction().toUpperCase().contains(MySecurityConstants.ALL_PRIVILEGES_ENTITY.toUpperCase())
                        || pv.getEntity().toUpperCase().contains(MySecurityConstants.ALL_PRIVILEGES_ENTITY.toUpperCase())
                      )
                .collect(Collectors.toList());
        if(action != null && !action.equalsIgnoreCase("all") && !privileges.isEmpty()){
            return !privileges.stream()
                .filter(pv -> pv.getAction() != null &&
                  (pv.getAction().toLowerCase().contains(action.toLowerCase())
                     || pv.getAction().equalsIgnoreCase("all")
                    || pv.getAction().toUpperCase().contains(MySecurityConstants.ALL_PRIVILEGES_ENTITY.toUpperCase())
                    || pv.getEntity().toUpperCase().contains(MySecurityConstants.ALL_PRIVILEGES_ENTITY.toUpperCase())
                  ))
                .collect(Collectors.toList()).isEmpty();
        }
        return !privileges.isEmpty();
    }

    public List<Privilege> extractPrivileges(){
       return SecurityContextHolder
        .getContext()
        .getAuthentication()
        .getAuthorities()
        .stream()
        .filter(authority -> authority.getAuthority().startsWith(MySecurityConstants.PRIVILEGE_STRING_PREFIX))
        .map(authority -> convertPrivilegeFromAuthotityName(authority.getAuthority()))
        .collect(Collectors.toList());
    }

    public List<GrantedAuthority> extractAuthorities() {
        return SecurityContextHolder
        .getContext()
        .getAuthentication()
        .getAuthorities()
        .stream()
        .filter(authority -> !authority.getAuthority().startsWith(MySecurityConstants.PRIVILEGE_STRING_PREFIX))
        .collect(Collectors.toList());
    }

    /* convert before authenticated */
    public List<GrantedAuthority> covertPrivilegesToAuthorities( List<GrantedAuthority> grantedAuthorities){
        return privilegeRepository.findByAuthorityInIgnoreCase(
                grantedAuthorities.stream()
                .map(authority ->authority.getAuthority()).collect(Collectors.toList()))
                .stream().map(pv -> new SimpleGrantedAuthority(conveterPrivilegeToAuthotityName(pv)))
                .collect(Collectors.toList());
    }

    /* convert after authenticated */
    public List<GrantedAuthority> covertPrivilegesToAuthorities(){
        List<String> authorities = SecurityContextHolder.getContext()
        .getAuthentication()
        .getAuthorities()
        .stream()
        .map(authority -> authority.getAuthority())
        .collect(Collectors.toList());
        return privilegeRepository.findByAuthorityInIgnoreCase(authorities)
                .stream().map(pv -> new SimpleGrantedAuthority(conveterPrivilegeToAuthotityName(pv)))
                .collect(Collectors.toList());
    }

    private String conveterPrivilegeToAuthotityName(Privilege privilege){
        return MySecurityConstants.PRIVILEGE_STRING_PREFIX + 
               privilege.getId() + MySecurityConstants.PRIVILEGE_FIELDS_SEPARATOR +
               privilege.getAuthority() + MySecurityConstants.PRIVILEGE_FIELDS_SEPARATOR +
               privilege.getEntity() + MySecurityConstants.PRIVILEGE_FIELDS_SEPARATOR +
               privilege.getAction() + MySecurityConstants.PRIVILEGE_FIELDS_SEPARATOR +
               privilege.isConstrained();
    }

    private Privilege convertPrivilegeFromAuthotityName(String authorityName){
        String privilegeStr = authorityName.substring(MySecurityConstants.PRIVILEGE_STRING_PREFIX.length());
        if(privilegeStr != null){
            String[] split = privilegeStr.split(MySecurityConstants.PRIVILEGE_FIELDS_SEPARATOR);
            if(split != null && split.length >0){
                Privilege privilege = new Privilege();
                for (int i = 0; i < split.length; i++) {
                    if(i == 0) privilege.setId(Long.valueOf(split[i]));
                    else if(i == 1) privilege.setAuthority(split[i]);
                    else if(i == 2) privilege.setEntity(split[i]);
                    else if(i == 3) privilege.setAction(split[i]);
                    else privilege.setConstrained(Boolean.valueOf(split[i]));
                }
                return privilege;
            }
        }
        return null;
    }
    
}
