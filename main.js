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
        const whenStart = when.querySelector('.start')
        const whenEnd = when.querySelector('.end')
        const startDate = whenStart
            ? convertDateText(whenStart.innerText)
            : 'Unknown'
        const endDate = whenEnd
            ? convertDateText(whenEnd.innerText)
            : 'Present'
        if (startDate !== endDate) {
            when.innerText = `${startDate}\u2013${endDate}`
        } else {
            when.innerText = startDate
        }
        where.append(when)
    })

document.querySelectorAll('#experience .project-desc')
    .forEach(elem => {
        if (elem.innerHTML.startsWith(': ')) {
            elem.innerHTML = elem.innerHTML.substring(2)
        }
    })

function convertDateText(text) {
    const date = new Date(text)
    return `${monthAbbr[date.getUTCMonth()]} ${String(date.getUTCFullYear()).padStart(4, '0')}`
}
