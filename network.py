# -*- coding:utf-8 -*- #
#!/usr/bin/env python
import os,datetime,urllib,urllib2
import random,cookielib,re,string,time
import json
import chardet
import poster
import config

class NetworkManager():
    def __init__(self):
        poster.streaminghttp.register_openers()
    def get(self,url,**kwds):
        req = urllib2.Request(url)
        headers = {'User-Agent'      : 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)',
                   'Cookie'         : kwds.get('cookie', ''),
                   'Referer'        : kwds.get('refer', 'http://bbs.nju.edu.cn'),}
        for key in headers.keys():
            req.add_header(key, headers[key])
        try:
            resp = urllib2.urlopen(req)
            result = resp.read()
            return result
        except urllib2.HTTPError, e:
            print 'req',url,'error',e.code
            return False
    def post(self,url,data,headers={}):
        t_headers = {'Accept'         : 'text/plain',
                     'User-Agent'     : 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)',
                     'Origin'         : 'http://bbs.nju.edu.cn',
                     'Host'           : 'bbs.nju.edu.cn'}
        t_headers.update(headers)
        request = urllib2.Request(url, data, t_headers)
        try:
            response = urllib2.urlopen(request)
            return response
        except urllib2.HTTPError, e:
            print 'req',url,'error',e.code
            return False


class LilyService():
    def __init__(self,username,password,cookie,vd):
        self.vd = vd
        self.username = username
        self.password = password
        self.cookie = cookie
        self.net = NetworkManager()
    def __init__(self,username,password):
        self.vd = str( random.randint(1000,10000) )
        self.username = username
        self.password = password
        self.cookie = ""
        self.net = NetworkManager()
        self.doLogin()
    def exists(self, file):
        try:
            response = urllib2.urlopen('http://bbs.nju.edu.cn/file/%c/%s/%s' % (config.username.upper()[0], config.username, file))
            return True
        except urllib2.HTTPError, e:
            return False
    def deleteFile(self, filename):
        print self.net.get( 'http://bbs.nju.edu.cn/vd%s/bbsudel?file=%s&board=MAILBOX' % (self.vd, filename),
                            cookie = self.cookie, refer = 'http://bbs.nju.edu.cn/vd%s/bbsfdoc?board=MAILBOX' % self.vd )
    def doUpload(self, filename, folder):
        if self.exists(filename):
            print filename,'exists delete'
            self.net.get( 'http://bbs.nju.edu.cn/vd%s/bbsudel?file=%s&board=MAILBOX' % (self.vd, filename),
                            cookie = self.cookie, refer = 'http://bbs.nju.edu.cn/vd%s/bbsfdoc?board=MAILBOX' % self.vd )
        print filename,'uploading'
        filename = '\\'.join([folder,filename]);
        datagen, headers = poster.encode.multipart_encode([("up", open(filename, "rb")),("exp",""),("ptext",""),("board","MAILBOX")])
        headers.update({
            'Cookie' : self.cookie,
            'Referer' : 'http://bbs.nju.edu.cn/vd%s/bbsupload?board=MAILBOX' % self.vd
            })
        resp = self.net.post( 'http://bbs.nju.edu.cn/vd%s/bbsdoupload' % self.vd,
                        datagen, headers )
        result = resp.read()
        matched_objs = re.findall("file=([^&]*)&name=([^&]*)&", result)
        for obj in matched_objs:
            self.net.get( 'http://bbs.nju.edu.cn/vd%s/bbsupload2?board=MAILBOX&file=%s&name=%s&exp=&ptext='
                      % ( self.vd, obj[0], obj[1] ), cookie = self.cookie, refer = 'http://bbs.nju.edu.cn/vd%s/bbsdoupload' % self.vd )
    def getFileList(self):
        result = self.net.get( "http://bbs.nju.edu.cn/vd%s/bbsfdoc?board=MAILBOX" % self.vd,
                                cookie = self.cookie )
        result = result.decode('gb2312')
        print result
    def doLogin(self):
        result = self.net.get( "http://bbs.nju.edu.cn/vd%s/bbslogin?type=2&id=%s&pw=%s"
                                % (self.vd , self.username, self.password) )
        if result:
            matched_objs = re.findall("Net\.BBS\.setCookie\('([^']*?)'\)", result)

            P_U_KEY = 0
            P_U_NUM= 0
            for obj in matched_objs:
                p = ''
                pp = obj.index('N')
                p2 = ''
                for i in range(0,pp):
                    p += obj[i]
                for i in range(pp+1,len(obj)):
                    p2 += obj[i]
                ppp = p2.split('+')
                P_U_KEY =string.atoi(ppp[1],10)-2
                P_U_NUM = string.atoi(p,10)+2
            self.cookie = "_U_NUM=%s;_U_UID=%s;_U_KEY=%s;" % (str(P_U_NUM) , self.username , str(P_U_KEY))
            self.cookie = unicode(self.cookie,'gb2312')

        else:
            print 'login fail'