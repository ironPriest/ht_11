import {Router} from "express";
import {securityDeviceController} from "../composition-root";

export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/', securityDeviceController.getDevices.bind(securityDeviceController) )
securityDevicesRouter.delete('/', securityDeviceController.deleteOtherDevices.bind(securityDeviceController) )
securityDevicesRouter.delete('/:deviceId', securityDeviceController.deleteDevice.bind(securityDeviceController) )