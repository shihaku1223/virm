'use strict'

const randomMac = require('random-mac');

import Device from '../device'
import Description from '../../desc';
import TapDevice from './TapDevice';

class NetworkDevice extends Device
{
    constructor(netdev) {
        super();
        this._netdev = netdev;
        this.mac = randomMac();
    }

    get netdev() {
        Object.setPrototypeOf(this._netdev, Description.prototype);

        switch(this._netdev.type) {
            case 'TapDevice':
                Object.setPrototypeOf(this._netdev,
                        TapDevice.prototype);
                break;
            default:
                console(this._netdev.type + " not supported");
        }

        return this._netdev;
    }


    get mac() {
        return this._mac;
    }

    set mac(mac) {
        this._mac = mac;
    }

    get ip() {
        return this._ip;
    }

    set ip(ip) {
        this._ip = ip;
    }

    get name() {
        return this.netdev.name;
    }

    up() {
        this.netdev.up();
    }

    down() {
        this.netdev.down();
    }
}

export default NetworkDevice;