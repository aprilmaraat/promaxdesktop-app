"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPC = exports.MESSAGE_TEXT = exports.MESSAGE_TYPE = void 0;
var MESSAGE_TYPE;
(function (MESSAGE_TYPE) {
    MESSAGE_TYPE["success"] = "success";
    MESSAGE_TYPE["error"] = "error";
    MESSAGE_TYPE["warning"] = "warning";
})(MESSAGE_TYPE = exports.MESSAGE_TYPE || (exports.MESSAGE_TYPE = {}));
var MESSAGE_TEXT;
(function (MESSAGE_TEXT) {
    MESSAGE_TEXT["apiError"] = "Error accessing the API. Please contact your system administrator.";
    MESSAGE_TEXT["registerSuccess"] = "Registration successful! Please login with the details you have registered.";
    MESSAGE_TEXT["serverDown"] = "Server is down. Please contact your system administrator.";
    MESSAGE_TEXT["sessionExpired"] = "License session expired.";
    MESSAGE_TEXT["invalidLicense"] = "Invalid license.";
    MESSAGE_TEXT["syncServiceStopped"] = "Sync service has stopped.";
    MESSAGE_TEXT["pleaseWait"] = "Please wait.";
    MESSAGE_TEXT["syncthingBooting"] = "Syncthing is booting up.";
})(MESSAGE_TEXT = exports.MESSAGE_TEXT || (exports.MESSAGE_TEXT = {}));
var IPC;
(function (IPC) {
    IPC["SET_WINDOW_SIZE"] = "set-window-size";
    IPC["REFRESH_CHANGES"] = "refresh-changes";
    IPC["OPEN_DEV_TOOLS"] = "dev-tools-window";
    IPC["MINIMIZE_WINDOW"] = "minimize-window";
    IPC["MAXIMIZE_WINDOW"] = "maximize-window";
    IPC["CLOSE_WINDOW"] = "close-window";
    IPC["START_SYNC_SERVICE"] = "start-sync-service";
    IPC["STOP_SYNC_SERVICE"] = "stop-sync-service";
    IPC["FEDERATE_SEARCH_NAV"] = "federate-search-nav";
    IPC["FEDERATE_SEARCH_RESULT"] = "federate-search-result";
    IPC["SHOW_STOPPED_SYNCTHING"] = "show-stopped-syncthing";
    IPC["KILL_PIDS"] = "kill-pids";
})(IPC = exports.IPC || (exports.IPC = {}));
