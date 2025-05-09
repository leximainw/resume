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


let dragging = null
let dragTarget = null
let dragFrom = null
let dragSpacer = null
document.querySelectorAll('article, li')
    .forEach(elem => {
        elem.addEventListener('mousedown', event => {
            if (dragTarget) {
                return
            }
            //if (!elem.classList.contains('drag')) {
            //    return
            //}
            dragging = false
            dragTarget = elem
            elemRect = elem.getBoundingClientRect()
            dragFrom = {
                x: event.pageX,
                y: event.pageY - (elemRect.top + window.scrollY),
                baseX: elemRect.left + window.scrollX,
            }
            event.stopPropagation()
            event.preventDefault()
        })
    })

document.querySelector('body').addEventListener('mousemove', event => {
    if (!dragTarget) {
        return
    }
    let pageX = event.pageX
    let pageY = event.pageY
    let deltaX = pageX - dragFrom.x
    let deltaY = pageY - dragFrom.y
    if (dragging) {
        let dx = deltaX / 8;
        dragTarget.style.left = `${dragFrom.baseX + (dx / Math.sqrt(1 + dx * dx)) * 8}px`
        dragTarget.style.top = `${deltaY}px`
    } else if (deltaX * deltaX + deltaY * deltaY > 16) {
        if (!dragging) {
            dragging = true
            elemRect = dragTarget.getBoundingClientRect()
            dragSpacer = document.createElement('div')
            dragSpacer.style.width = `${dragTarget.clientWidth}px`
            dragSpacer.style.height = `${dragTarget.clientHeight}px`
            dragTarget.after(dragSpacer)
            dragTarget.classList.add('dragging')
            dragTarget.parentElement.classList.add('dragFlow')
            dragTarget.style.width = `${elemRect.right - elemRect.left}px`
        }
    }
    event.stopPropagation()
    event.preventDefault()
})

document.querySelector('body').addEventListener('mouseup', event => {
    if (!dragTarget) {
        return
    }
    if (!dragging) {
        if (dragTarget.classList.contains('hidden')) {
            dragTarget.classList.remove('hidden')
        } else {
            dragTarget.classList.add('hidden')
        }
    } else {
        dragTarget.classList.remove('dragging')
        dragTarget.parentElement.classList.remove('dragFlow')
        dragTarget.style.left = null
        dragTarget.style.top = null
        dragTarget.style.width = null
        dragSpacer.remove()
        dragSpacer = null
    }
    dragTarget = null
    event.stopPropagation()
    event.preventDefault()
})

function convertDateText(text) {
    const date = new Date(text)
    return `${monthAbbr[date.getUTCMonth()]} ${String(date.getUTCFullYear()).padStart(4, '0')}`
}
