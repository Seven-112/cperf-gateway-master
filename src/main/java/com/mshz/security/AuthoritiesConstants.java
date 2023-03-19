package com.mshz.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String USER = "ROLE_USER";

    public static final String PROVIDER = "ROLE_PROVIDER";

    public static final String EMPLOYEE = "ROLE_EMPLOYEE";

    public static final String CLIENT = "ROLE_CLIENT";

    public static  final String DEVELOPER = "ROLE_DEVELOPER";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";
   
    // tender evaluator
    public static final String EVALUATOR = "ROLE_EVALUATOR";

    public static final String PROVIDER_VALIDATOR = "ROLE_PROVIDER_VALIDATOR";

    private AuthoritiesConstants() {
    }
}
