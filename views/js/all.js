function readyFunc() {
    showCourseList();
    $('#search-stu').on('input', searchGrade);
}

function searchGrade() {
    let studentName = $('#search-stu').val();
    if (studentName) {
        $.ajax({
            url: '/searchGrade',
            type: 'GET',
            data: {
                stuName: studentName
            }
        })
        .done(res => {
            // console.log(res);
            $('#grade-list').empty('');
            if (res.length === 0) {
                $('#grade-list').append(`<a id="no-found">No found</a>`)
            } else {
                filterItem(res)
                .sort(el => el.id_stu)
                .map(el => {
                    $('#grade-list').append(`
                        <div class="item">
                            <div class="cou-header">
                                <a>Student ID: ${el.id_stu}</a><br/>
                                <a>${el.name_stu}</a>
                            </div>
                            <div class="student-list">
                                ${el.couList.map(el => {
                                    return `
                                    <div class="student">
                                        <a class="student-name">${el.name_cou}</a>
                                        <a>/ Grade: ${el.grade_cou} / ${getPassOrNot(el.grade_cou)}</a>
                                    </div>`
                                }).join('')}
                            </div>
                        <div>
                    `);
                })
            }
        })
    } else {
        $('#grade-list').html(`<a>Enter the value!</a>`);
    }
}

function getPassOrNot(grade) {
    return grade >= 60 ? '<a class="pass">Pass</a>' : '<a class="fail">Fail</a>';
}

function filterItem(res) {
    let list = new Set([])
    let newRes = res.reduce((acc, el) => {
        if (list.has(el.id_stu)) {
            acc.map(e => {
                if (e.id_stu === el.id_stu) {
                    e.couList.push({
                        id_cou: el.id_cou,
                        name_cou: el.name_cou,
                        grade_cou: el.grade_cou
                    });
                }
            });
            return acc;
        } else {
            list.add(el.id_stu)
            acc.push({ 
                id_stu: el.id_stu,
                name_stu: el.name_stu,
                couList: [
                    {
                        id_cou: el.id_cou,
                        name_cou: el.name_cou,
                        grade_cou: el.grade_cou
                    }
                ]
            });
            return acc;
        }
    }, [])
    return newRes
}

function showCourseList() {
    $.ajax({
        url: '/studentList',
        type: 'GET',
    })
    .done(res => {
        let unOrderList = $('<ul></ul>')
        res.map(el => {
            unOrderList.append(`
                <li>${el.name_stu}</li>
            `);
        })
        $('#student-list').append(unOrderList);
    })
}

$(document).ready(readyFunc);