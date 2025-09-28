// backend/middleware/role.middleware.js

const rolePermissions = {
    'Sales': {
        tasks: ['view'],
        machines: ['view'],
        users: ['view']
    },
    'Commercial Team': {
        tasks: ['view'],
        machines: ['view'],
        users: ['view']
    },
    'Engineer': {
        tasks: ['view', 'create', 'update'],
        machines: ['view', 'create', 'update'],
        users: ['view']
    },
    'Management': {
        tasks: ['view', 'create', 'update', 'delete'],
        machines: ['view', 'create', 'update', 'delete'],
        users: ['view', 'create', 'update']
    },
    'Service Head': {
        tasks: ['view', 'create', 'update', 'delete'],
        machines: ['view', 'create', 'update', 'delete'],
        users: ['view', 'create', 'update', 'delete']
    }
};

// Utility to check permission
function hasPermission(userRole, resource, action) {
    const permissions = rolePermissions[userRole];
    if (!permissions) return false;
    const resourcePermissions = permissions[resource];
    if (!resourcePermissions) return false;
    return resourcePermissions.includes(action);
}

// Middleware to check permissions
function checkPermission(resource, action) {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (!hasPermission(userRole, resource, action)) {
            return res.status(403).json({
                message: 'Access denied',
                error: `Role '${userRole}' does not have '${action}' permission for '${resource}'`,
                allowedActions: rolePermissions[userRole]?.[resource] || []
            });
        }
        next();
    };
}

// Middleware for view-only roles (Sales, Commercial Team)
function viewOnlyRoles(req, res, next) {
    const userRole = req.user.role;
    if (['Sales', 'Commercial Team'].includes(userRole)) {
        if (req.method !== 'GET') {
            return res.status(403).json({
                message: 'Access denied',
                error: `Role '${userRole}' has view-only access`,
                allowedMethods: ['GET']
            });
        }
    }
    next();
}

// Middleware: engineers can only create/update machines (and view everything)
function engineerMachineOnly(req, res, next) {
    const userRole = req.user.role;
    if (userRole === 'Engineer') {
        // Allow GET everywhere, POST/PUT/PATCH/DELETE only on /machine/ endpoints
        const isMachineEndpoint = req.originalUrl.includes('/machine');
        if (!isMachineEndpoint && req.method !== 'GET') {
            return res.status(403).json({
                message: 'Access denied',
                error: 'Engineers can only create/update machines. All other create/update operations are restricted.',
                allowedOperations: ['View all', 'Create/Update machines only']
            });
        }
    }
    next();
}

function rbac(roles) {
  return function (req, res, next) {
    // Your RBAC logic here
    // Example:
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

module.exports = {
    hasPermission,
    checkPermission,
    viewOnlyRoles,
    engineerMachineOnly,
    rolePermissions,
    rbac,
};
