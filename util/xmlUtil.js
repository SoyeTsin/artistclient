/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-10-30
 * Time: 下午1:48
 * To change this template use File | Settings | File Templates.
 */

var xmlreader = require('xmlreader');

var fs = require("fs");

fs.readFile('util/ChinaArea.xml', {encoding: "utf-8"}, function (err, data) {
    if (err) throw err;
    console.log(data);
    xmlreader.read(data, function (err, res) {
        if (err) return console.log(err);
        var json = {};
        var provinces = [];   //国家包含的省份
        //省份
        for (var i = 0; i < res.area.province.count(); i++) {
            var province = res.area.province.at(i);
            var citys = [];
            var provinceName = province.attributes().province;
            provinces.push(provinceName);
           // console.log(provinceName);
            if (province.city) {
                //市
                for (var c = 0; c < province.city.count(); c++) {
                    var city = province.city.at(c);
                    var districts = [];
                    var cityName = city.attributes().city;

                    // console.log(cityName);
                    citys.push(cityName);
                    if (city.district) {
                        for (var d = 0; d < city.district.count(); d++) {
                            var district = city.district.at(d);
                            var districtName = district.attributes().district;
                            districts.push(districtName);
                            //  console.log(districtName);
                        }
                        json[cityName] = districts;
                    }
                }
                json[provinceName] = citys;
            }
        }
        json["中国"] = provinces;
        console.log(JSON.stringify(json));

        fs.writeFile("location.json",JSON.stringify(json),"utf-8",function(err){
            console.log("err:"+err);
        });
    });
});

fs.readFile('util/industry-data.xml', {encoding: "utf-8"}, function (err, data) {
    if (err) throw err;
    console.log(data);
    xmlreader.read(data, function (err, res) {
        if (err) return console.log(err);
        var json = {};
        var industrys = [];   //行业包含的子行业
        //省份
        for (var i = 0; i < res.root.industry.count(); i++) {
            var industry = res.root.industry.at(i);
            var subIndustrys = [];
            var industryName = industry.attributes().name;
            industrys.push(industryName);
            if (industry.subIndustry) {
                for (var c = 0; c < industry.subIndustry.count(); c++) {
                    var subIndustry = industry.subIndustry.at(c);
                    var subIndustryName = subIndustry.attributes().name;
                    subIndustrys.push(subIndustryName);
                }
                json[industryName] = subIndustrys;
            }
        }
        json["行业"] = industrys;
        console.log(JSON.stringify(json));
        fs.writeFile("industry.json",JSON.stringify(json),"utf-8",function(err){
            console.log("err:"+err);
        });
    });
});



