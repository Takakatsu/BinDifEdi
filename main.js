const myData = {
	appName: "BinDiffEdit",
	bin_data1: "",
	bin_data2: "",
	line_len: 64,
}

const app = Vue.createApp({
	data() {
		return myData;
	},
	created() {
		console.log("created!!");
	},
	methods: {
		bin_diff1: function () {
			var str = "";
			for (var i = 0; i < this.bin_data1.length; i++) {
				if(i%this.line_len==0&&i!=0)str+= "<br>";
				let tf = (this.bin_data2.length > i) ? (this.bin_data1[i] == this.bin_data2[i]) ? false : true : true;
				if (tf) {
					str = str + "<span style=\"color:red\">"
				}
				str = str + this.bin_data1[i];
				if (tf) {
					str = str + "</span>"
				}
			}
			return str;
		},
		bin_diff2: function () {
			var str = "";
			for (var i = 0; i < this.bin_data2.length; i++) {
				if(i%this.line_len==0&&i!=0)str+= "<br>";
				let tf = (this.bin_data1.length > i) ? (this.bin_data1[i] == this.bin_data2[i]) ? false : true : true;
				if (tf) {
					str = str + "<span style=\"color:red\">"
				}
				str = str + this.bin_data2[i];
				if (tf) {
					str = str + "</span>"
				}
			}
			return str;
		},
		hexStr2byteAry: function (hexs, sep = '') {
			hexs = hexs.trim(hexs);
			if (sep == '') {
				var array = [];
				for (var i = 0; i < hexs.length / 2; i++)
					array[i] = parseInt(hexs.substr(i * 2, 2), 16);
				return array;
			} else {
				return hexs.split(sep).map((h) => {
					return parseInt(h, 16);
				});
			}
		},
		byteAry2hexStr: function (bytes, sep = '', pref = '') {
			if (bytes instanceof ArrayBuffer)
				bytes = new Uint8Array(bytes);
			if (bytes instanceof Uint8Array)
				bytes = Array.from(bytes);

			return bytes.map((b) => {
				const s = b.toString(16);
				return pref + (b < 0x10 ? ('0' + s) : s);
			}).join(sep);
		},
		bin_save1: function () {
			var target = this.bin_data1.replace(/\r?\n|\s/g, '');
			var array = this.hexStr2byteAry(target);
			var buffer = new ArrayBuffer(array.length);
			var dv = new DataView(buffer);
			for (var i = 0; i < array.length; i++)
				dv.setUint8(i, array[i]);
			var blob = new Blob([buffer], { type: "octet/stream" });
			var url = window.URL.createObjectURL(blob);
			var a = document.createElement("a");
			a.href = url;
			a.target = '_blank';
			a.download = "array.bin";
			a.click();
			window.URL.revokeObjectURL(url);
		},
		bin_save2: function () {
			var target = this.bin_data2.replace(/\r?\n|\s/g, '');
			var array = this.hexStr2byteAry(target);
			var buffer = new ArrayBuffer(array.length);
			var dv = new DataView(buffer);
			for (var i = 0; i < array.length; i++)
				dv.setUint8(i, array[i]);
			var blob = new Blob([buffer], { type: "octet/stream" });
			var url = window.URL.createObjectURL(blob);
			var a = document.createElement("a");
			a.href = url;
			a.target = '_blank';
			a.download = "array.bin";
			a.click();
			window.URL.revokeObjectURL(url);
		},
		bin_open1: function (e) {
			var file = e.target.files[0];
			var reader = new FileReader();
			reader.onload = (theFile) => {
				this.bin_data1 = this.byteAry2hexStr(new Uint8Array(theFile.target.result));
			};
			reader.readAsArrayBuffer(file);
		},
		bin_open2: function (e) {
			var file = e.target.files[0];
			var reader = new FileReader();
			reader.onload = (theFile) => {
				this.bin_data2 = this.byteAry2hexStr(new Uint8Array(theFile.target.result));
			};
			reader.readAsArrayBuffer(file);
		},
		binary_click: function (e) {
			e.target.value = '';
		},
		line_len_dec: function(){
			this.line_len/=2;
			if(this.line_len<1)this.line_len=1;
		},
		line_len_inc: function(){
			this.line_len*=2;
		},
	}
});
app.mount("#app");
