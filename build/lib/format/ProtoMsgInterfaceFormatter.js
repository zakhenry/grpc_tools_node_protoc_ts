"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TplEngine_1 = require("../TplEngine");
const MessageFormatter_1 = require("./partial/MessageFormatter");
const ExtensionFormatter_1 = require("./partial/ExtensionFormatter");
const EnumFormatter_1 = require("./partial/EnumFormatter");
var ProtoMsgInterfaceFormatter;
(function (ProtoMsgInterfaceFormatter) {
    function format(descriptor, exportMap) {
        let fileName = descriptor.getName();
        let packageName = descriptor.getPackage();
        let imports = [];
        let messages = [];
        let extensions = [];
        let enums = [];
        descriptor.getMessageTypeList().forEach(enumType => {
            messages.push(MessageFormatter_1.MessageFormatter.format(fileName, exportMap, enumType, 0, descriptor));
        });
        descriptor.getExtensionList().forEach(extension => {
            extensions.push(ExtensionFormatter_1.ExtensionFormatter.format(fileName, exportMap, extension, 0));
        });
        descriptor.getEnumTypeList().forEach(enumType => {
            enums.push(EnumFormatter_1.EnumFormatter.format(enumType, 0));
        });
        return TplEngine_1.TplEngine.render('msg_interface', {
            packageName: packageName,
            fileName: fileName,
            imports: imports,
            messages: messages,
            extensions: extensions,
            enums: enums,
        });
    }
    ProtoMsgInterfaceFormatter.format = format;
})(ProtoMsgInterfaceFormatter = exports.ProtoMsgInterfaceFormatter || (exports.ProtoMsgInterfaceFormatter = {}));
//# sourceMappingURL=ProtoMsgInterfaceFormatter.js.map