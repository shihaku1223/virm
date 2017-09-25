'use strict'

const vorpal = require('vorpal')();

import SubProcess from './module/process';
import Manager from './manager';

const manager = Manager.getInstance();
const WORKING_DIR = __dirname;

vorpal
    .command('list <category>', 'List category.')
    .alias('l')
    .action(function(args, cb) {
        manager.list(args.category);
        cb();
    });

vorpal
    .command('create <category>', 'Create item.')
    .option('--name <name>', 'Set the name.')
    .option('--path <path>', 'Set the path.')
    .option('--size <size>', 'Set the size (in byte).')
    .option('--busnum <size>', 'The busnum of PCI device "01:00.0".')
    .option('--net <net>', 'The route target.')
    .option('--mask <mask>', 'The netmask of the network.')
    .option('--gw <gw>', 'Route packets via a gateway.')
    .option('--dev <netdev_uuid>', 'Set the route to be associated with the specified device.')
    .alias('c')
    .action(function(args, cb) {
        switch(args.category.toString()) {
            case "vm":
                manager.createVM(args.options.name);
                break;
            case "disk":
                manager.createDisk(
                        args.options.path,
                        args.options.size);
                break;
            case "pci":
                manager.createPCIDevice(
                        args.options.busnum);
            case "net":
                manager.createNetworkDevice();
                break;
            case "route":
                manager.createRouteDevice(
                        args.options.net,
                        args.options.mask,
                        args.options.gw,
                        args.options.dev);
                break;
            default:
                console.log("Not support " + args.category + " creation.");
        }
        cb();
    });

vorpal
    .command('vm add <category> <uuid>', 'Start a device <uuid> to vm.')
    .option('--uuid <uuid>', 'the uuid of vm.')
    .alias('a')
    .action(function(args, cb) {
        if(args.options.uuid !== undefined) {
            console.log("add " + args.category + " " + args.uuid +
                    " to vm " + args.options.uuid);
            manager.addDeviceToVM(args.options.uuid,
                    args.category,
                    args.uuid);
        }
        cb();
    });

vorpal
    .command('start <category> <uuid>', 'Start a device.')
    .alias('s')
    .action(function(args, cb) {
        if(args.uuid !== undefined)
            manager.start(args.category, args.uuid);
        cb();
    });

vorpal
    .command('stop <category> <uuid>', 'Stop a device.')
    .alias('S')
    .action(function(args, cb) {
        if(args.uuid !== undefined)
            manager.stop(args.category, args.uuid);
        cb();
    });

vorpal
    .command('agent <uuid>', 'Create a client to control specified vm.')
    .alias('A')
    .action(function(args, cb) {
        if(args.uuid !== undefined)
            manager.createAgent(args.uuid);
        cb();
    });

vorpal
    .command('damain <uuid>')
    .option('--ip <ip>', 'The ip set to vm')
    .action(function(args, cb) {
        manager.startupDAMain(
                args.uuid,
                args.options.ip);
        cb();
    });

vorpal
    .delimiter('virmanager:')
    .show()
    .parse(process.argv);