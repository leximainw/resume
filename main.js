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
            ? new Date(whenStart.innerText)
                .toUTCString()
            : 'Unknown'
        const endDate = whenEnd
            ? new Date(whenEnd.innerText)
                .toUTCString()
            : 'Present'
        console.log(`${startDate} - ${endDate}`)
    })
