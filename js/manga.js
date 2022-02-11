let $ = jQuery;

$('#submit_url').click(function(){
	let url = $('#input_url').val();
    $('#input_url').val('Processing').attr("disabled", 'disabled');
    fetch('https://api.kdevz.net/manga/kiryuu/?url=' + url )
        .then(res => res.json())
        .then(res => {
          let date, tgl, bulan, jam, menit, detik, waktu;
          date  = new Date();
          bulan = (date.getMonth().toString().length == 1) ? "0" + (date.getMonth()+1) : (date.getMonth()+1);
          tgl   = (date.getDate().toString().length == 1) ? "0" + date.getDate() : date.getDate();
          jam   = (date.getHours().toString().length == 1) ? "0" + date.getHours() : date.getHours();
          menit = (date.getMinutes().toString().length == 1) ? "0" + date.getMinutes() : date.getMinutes();
          detik = (date.getSeconds().toString().length == 1) ? "0" + date.getSeconds() : date.getSeconds();
          waktu = date.getFullYear() +"-"+ bulan +"-"+ tgl +"T"+ jam +":"+ menit +":"+ detik + "+07:00" ;

            let frontMatter = `--- \ntitle: "Chapter ${res.chapter} Bahasa Indonesia" \ndate: ${waktu}  \nseries: "${res.series}" \nchapter: "${res.chapter}" \n---\n\n\n`;
            let gambarUrl = res.imgurl.replace(/\[|\]|\\|\"/g, "").split(",");
            let output = "";
            $(gambarUrl).each((index, element) => {
              output += `![gambar ${index+1}](${element})\n`;
            });
            // output
            $('#filename').text("Ch-" + res.chapter + ".md");
            $('#sebelum').val(frontMatter + output);
        })
        .then(succ => {
            $('#input_url').val('').removeAttr("disabled", 'disabled');
            $('#save_file').ready(function(){
              let data, name, type;
              data = $('#sebelum').val();
              name = $('#filename').text();
              type = "text/plain";
            
              var file = new Blob([data], {type: type});
                if (window.navigator.msSaveOrOpenBlob) // IE10+
                    window.navigator.msSaveOrOpenBlob(file, name);
                else { // Others
                    var a = document.createElement("a"),
                            url = URL.createObjectURL(file);
                    a.href = url;
                    a.download = name;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function() {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);  
                    }, 0); 
                }
            
            });
        })
        .catch(e => console.log(e));
});

function grab(){
  let start = parseInt($('#start_link').val()); 
  let stop = parseInt($('#stop_link').val());
  let link = $('#raw_link').val();
  for (i=start; i<=stop; i++) {
    let url = link + i;
    console.log(url); 
    // banyak ubah script tetep gagal, udah kehapus script sebelumnya
  }
}

// clear
function bersih(id) {
  document.getElementById(id).value = "";
}

// save file
function saveFile(){
  let data, name, type;
  data = document.getElementById('sebelum').value;
  name = document.getElementById('filename').innerText;
  type = "text/plain";

  var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, name);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }

}
