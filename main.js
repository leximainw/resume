const monthAbbr = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

document.getElementById("accent-color").addEventListener('change', e => {
    document.documentElement.style.setProperty('--accent-color', e.target.value)
})

document.getElementById("web-visibility").addEventListener('click', e => {
    if (e.target.checked) {
        document.body.classList.remove('always-hide')
    } else {
        document.body.classList.add('always-hide')
    }
})

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

document.querySelectorAll('.experience .project-desc')
    .forEach(elem => {
        if (elem.innerHTML.startsWith(': ')) {
            elem.innerHTML = elem.innerHTML.substring(2)
        }
    })

document.querySelector("#profile p").addEventListener('input', e => {
    if (e.target.innerText.trim() == "") {
        document.querySelector("#profile").classList.add('hidden')
    } else {
        document.querySelector("#profile").classList.remove('hidden')
    }
})


let dragging = null
let dragTarget = null
let dragFrom = null
let dragSpacer = null
let dragStart = 0
document.querySelectorAll('article, li')
    .forEach(elem => {
        elem.addEventListener('mousedown', event => {
            if (dragTarget) {
                return
            }
            dragging = false
            dragTarget = elem
            let elemRect = elem.getBoundingClientRect()
            dragFrom = {
                x: event.pageX,
                y: event.pageY,
                baseX: elemRect.left + window.scrollX,
                baseY: elemRect.top + window.scrollY,
                horiz: elem.parentElement.classList.contains('drag-horiz')
            }
            dragStart = Date.now()
            event.stopPropagation()
            event.preventDefault()
        })
    })

document.querySelector('body').addEventListener('mousemove', event => {
    if (!dragTarget) {
        return
    }
    let elemRect = dragTarget.getBoundingClientRect()
    let pageX = event.pageX
    let pageY = event.pageY
    let baseX = elemRect.left + window.scrollX
    let baseY = elemRect.top + window.scrollY
    let deltaX = (pageX - baseX) - (dragFrom.x - dragFrom.baseX)
    let deltaY = (pageY - baseY) - (dragFrom.y - dragFrom.baseY)
    let horiz = dragFrom.horiz
    if (dragging) {
        let dragRect = dragTarget.getBoundingClientRect()
        let parentRect = dragTarget.parentElement.getBoundingClientRect()
        if (horiz) {
            let dy = deltaY / 8
            let targetX = baseX + deltaX
            let newX = Math.min(Math.max(targetX, parentRect.left), parentRect.right)
            let dx = (targetX - newX) / 8
            newX += (dx / Math.sqrt(1 + dx * dx)) * 8
            dragTarget.style.left = `${newX}px`
            dragTarget.style.top = `${dragFrom.baseY + (dy / Math.sqrt(1 + dy * dy)) * 8}px`
        } else {
            let dx = deltaX / 8
            let targetY = baseY + deltaY
            let newY = Math.min(Math.max(targetY, parentRect.top), parentRect.bottom)
            let dy = (targetY - newY) / 8
            newY += (dy / Math.sqrt(1 + dy * dy)) * 8
            dragTarget.style.left = `${dragFrom.baseX + (dx / Math.sqrt(1 + dx * dx)) * 8}px`
            dragTarget.style.top = `${newY}px`
        }
        let dragMid = horiz ? dragRect.left + (dragFrom.x - dragFrom.baseX) + window.scrollX
            : dragRect.top + (dragFrom.y - dragFrom.baseY) + window.scrollY
        let inserted = false
        for (elem of dragTarget.parentElement.children) {
            if (elem === dragSpacer) {
                afterSpacer = true
                continue
            } else if (elem === dragTarget) {
                continue
            }
            let elemRect = elem.getBoundingClientRect()
            let elemMid = horiz ? (elemRect.left + elemRect.right) / 2 + window.scrollX
                : (elemRect.top + elemRect.bottom) / 2 + window.scrollY
            if (elemMid > dragMid) {
                elem.before(dragSpacer)
                inserted = true
                break
            }
        }
        if (!inserted) {
            dragTarget.parentElement.append(dragSpacer)
        }
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
    if (!dragging || (Date.now() - dragStart) < 100) {
        if (dragTarget.classList.contains('hidden')) {
            dragTarget.classList.remove('hidden')
            if (dragTarget.parentElement.classList.contains('collapsible')) {
                dragTarget.parentElement.classList.remove('hidden')
                let target = document.getElementById(dragTarget.parentElement.dataset.collapseTarget)
                target.classList.remove('hidden')
                while ((target = document.getElementById(target.dataset.collapseChain)) !== null) {
                    target.classList.remove('hidden')
                }
            }
        } else {
            dragTarget.classList.add('hidden')
            if (dragTarget.parentElement.classList.contains('collapsible')) {
                const HIDE_SELECTOR = ':scope > :not(.hidden, .hideable)'
                if (dragTarget.parentElement.querySelector(HIDE_SELECTOR) === null)
                    dragTarget.parentElement.classList.add('hidden')
                let target = document.getElementById(dragTarget.parentElement.dataset.collapseTarget)
                if (target.querySelector(HIDE_SELECTOR) === null) {
                    target.classList.add('hidden')
                    while ((target = document.getElementById(target.dataset.collapseChain)) !== null) {
                        if (target.querySelector(HIDE_SELECTOR) !== null)
                            break
                        target.classList.add('hidden')
                    }
                }
            }
        }
    }
    if (dragging) {
        dragTarget.classList.remove('dragging')
        dragTarget.parentElement.classList.remove('dragFlow')
        dragTarget.style.left = null
        dragTarget.style.top = null
        dragTarget.style.width = null
        dragSpacer.after(dragTarget)
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
