var ATM = {
    submit: function (element) {
        $.ajax({
            url: '/withdraw',
            type: 'POST',
            data: $(element).serialize(),
            dataType: 'JSON',
            beforeSend: function (xhr) {
                $(document).find('.error, .error-block, .output-table').remove();
                $('body').prepend('<div id="loader"><span style="height: '+ $(document).height() +'px"></span><img src="/images/ajax-loader.gif"></div>');
            },
            success: function (data, textStatus, jqXHR) {
                var html = '<table class="output-table">';
                html += '<thead>';
                html += '<tr>';
                html += '<th>Denomination</th>';
                html += '<th>Number of notes</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                $.each(data.data, function(key, value) {
                    html += '<tr>';
                    html += '<td>'+ key +'</td>';
                    html += '<td>'+ value +'</td>';
                    html += '</tr>';
                });
                html += '</tbody>';
                html += '</table>';
                $('#atm-form').append(html);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if(!jqXHR.status) {
                    alert("Server not working");
                    return false;
                }
                if(typeof jqXHR.responseJSON.data === 'object') {
                    $.each(jqXHR.responseJSON.data, function(key, value) {
                        $(document).find('input[name="'+ key +'"]').after('<p class="error">'+ value.join(', ') +'</p>');
                    });
                } else {
                    $('#atm-form').append('<div class="error-block">'+ jqXHR.responseJSON.data +'</div>');
                }
            },
            complete: function (jqXHR, textStatus) {
                $(document).find('#loader').remove();
            }
        });
    }
};