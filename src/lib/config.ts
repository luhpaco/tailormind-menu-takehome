/**
 * Unset during local development — the site falls back to the local mock
 * JSON until the real Sheet + Apps Script are deployed and this env var
 * is set (see apps-script/README.md).
 */
export const APPS_SCRIPT_URL = import.meta.env.PUBLIC_APPS_SCRIPT_URL || '';

export const MENU_ENDPOINT = APPS_SCRIPT_URL || `${import.meta.env.BASE_URL}mock/menu.json`;

export const ORDERS_ENDPOINT = APPS_SCRIPT_URL || null;
