# -*- coding:utf-8 -*- #
#!/usr/bin/env python
from os.path import exists
import os, shutil, errno, network, config, hasher
import time

def needUpdate(filename):
    if exists('backup/'+filename):
        md51 = hasher.CalcMD5('source/'+filename)
        md52 = hasher.CalcMD5('backup/'+filename)
        if md51 == md52:
            return 0
        else:
            return 1
    return 2

def genFileList():
    files = os.listdir('source/')
    need = []
    for fx in files:
        if ".min." in fx:
            continue
        if "check.js" not in fx:
            fx = compress(fx)
        v  = needUpdate(fx)
        if v > 0:
            need.append([fx,v])
    return need

def moveAndUpdate(files):
    newfolder = time.strftime("history/%Y.%m.%d.%H.%M.%S/")
    os.mkdir(newfolder);
    for fx in files:
        if fx[1] == 1:
            os.rename('backup/'+fx[0], newfolder+fx[0])
        shutil.copy('source/'+fx[0], 'backup/'+fx[0])
    lily = network.LilyService(config.username, config.password)
    print files
    for fx in files:
        lily.doUpload(fx[0],'backup/')
        time.sleep(0.2)

def compress(file):
    ext = os.path.splitext(file)
    if ext[1] == ".js":
        print "compress",file
        command = " ".join(["java -jar yuicompressor.jar",
                    os.path.join(os.path.abspath('.'), "source",file),
                    "-o",
                    os.path.join(os.path.abspath('.'), "source",ext[0]+".min.js")])
        os.system(command)
        time.sleep(0.2)
        return ext[0]+".min.js"
    else:
        return file

files = genFileList()
moveAndUpdate(files)

