[...document.querySelectorAll('#languages .skill')]
    .forEach(elem => {
        elem.style.width = `${elem.innerText}%`
        elem.innerText = ''
    })