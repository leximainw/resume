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
