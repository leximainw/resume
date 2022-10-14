const monthAbbr = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

document.querySelectorAll('#languages .skill')
    .forEach(elem => {
        if (elem.innerText > 100) {
            const overskillDiv = document.createElement('div')
            overskillDiv.classList.add('overskilled')
            const overskillImg = document.createElement('img')
            overskillImg.src = 'chevron-double-right.svg'
            overskillImg.alt = ''
            overskillDiv.append(overskillImg)
            elem.parentElement.after(overskillDiv)
        }
        elem.style.width = `${Math.min(elem.innerText, 100)}%`
        elem.innerText = ''
    })

document.querySelectorAll('#experience article')
    .forEach(elem => {
        const where = elem.querySelector('.where')
        const when = elem.querySelector('.when')
        if (!(where && when)) {
            return
        }
        let whenStart = when.querySelector('.start')
        let whenEnd = when.querySelector('.end')
        const startDate = whenStart
            ? convertDateText(whenStart.innerText)
            : 'Unknown'
        const endDate = whenEnd
            ? convertDateText(whenEnd.innerText)
            : 'Present'
        if (!whenStart) {
            whenStart = document.createElement('div')
            whenStart.classList.add('start')
        }
        whenStart.innerText = startDate
        if (!whenEnd) {
            whenEnd = document.createElement('div')
            whenEnd.classList.add('end')
        }
        whenEnd.innerText = endDate
        when.innerHTML = '&ndash;'
        when.prepend(startDate)
        when.append(endDate)
        where.append(when)
    })

function convertDateText(text) {
    const date = new Date(text)
    return `${monthAbbr[date.getUTCMonth()]} ${String(date.getUTCFullYear()).padStart(4, '0')}`
}
