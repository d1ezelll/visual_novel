document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("burger").addEventListener("click", function(){
        document.querySelector("header").classList.toggle("open")
    })
    
})

document.addEventListener('DOMContentLoaded', () => {
    
    const sections = document.querySelectorAll('.main > section');
    const footer = document.querySelector('.footer');
    const header = document.querySelector('header'); 
    const lastSection = document.querySelector('.main > section:last-child');
    let currentIndex = 0;
    let isScrolling = false;
    let isFooterVisible = false;
    let touchStartY = 0;
    let touchEndY = 0;

    sections[currentIndex].classList.add('active');
    updateHeaderVisibility(); 
    
    // Обработчики для колесика мышки и клавиш
    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    
    // Обработчики для touch-событий
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        if (isScrolling) {
            e.preventDefault();
            return;
        }
        touchEndY = e.touches[0].clientY;
    }

    function handleTouchEnd() {
        if (isScrolling) return;
        
        const deltaY = touchEndY - touchStartY;
        if (Math.abs(deltaY) < 50) return; // Минимальное расстояние свайпа
        
        const delta = Math.sign(deltaY);
        
        if (currentIndex === sections.length - 1 && delta > 0 && !isFooterVisible) {
            showFooter();
            return;
        }
        
        if (isFooterVisible && delta < 0) {
            hideFooter();
            return;
        }
        
        if (!isScrolling) {
            navigateTo(currentIndex - delta); // Инвертируем направление (свайп вниз = вверх по странице)
        }
    }

    function handleScroll(e) {
        if (isScrolling) return;
        
        const delta = Math.sign(e.deltaY);
        
        if (currentIndex === sections.length - 1 && delta > 0 && !isFooterVisible) {
            e.preventDefault();
            showFooter();
            return;
        }
        
        if (isFooterVisible && delta < 0) {
            e.preventDefault();
            hideFooter();
            return;
        }
        
        if (!isScrolling) {
            e.preventDefault();
            navigateTo(currentIndex + delta);
        }
    }

    function handleKeyDown(e) {
        if (isScrolling) return;
        
        if (['ArrowDown', 'PageDown'].includes(e.key)) {
            navigateTo(currentIndex + 1);
        } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
            navigateTo(currentIndex - 1);
        }
    }

    function navigateTo(newIndex) {
        newIndex = Math.max(0, Math.min(newIndex, sections.length - 1));
        if (newIndex === currentIndex || isScrolling) return;
        
        isScrolling = true;
        
        sections[currentIndex].classList.remove('active');
        sections[newIndex].classList.add('active');
        
        if (currentIndex === sections.length - 1 && newIndex !== sections.length - 1) {
            hideFooter();
        }
        
        currentIndex = newIndex;
        updateHeaderVisibility(); 
        
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }

    function showFooter() {
        if (isFooterVisible) return;
        
        isScrolling = true;
        isFooterVisible = true;
        
        lastSection.style.transform = 'translateY(-20vh)';
        footer.classList.add('visible');
        
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }

    function hideFooter() {
        if (!isFooterVisible) return;
        
        isScrolling = true;
        isFooterVisible = false;
        
        lastSection.style.transform = 'translateY(0)';
        footer.classList.remove('visible');
        
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }

    function updateHeaderVisibility() {
        if (!header) return;
        
        if (currentIndex >= 2) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
    }
    
    const magneticElements = document.querySelectorAll('.magnetic');
    const magneticSettings = {
        distance: 20,
        activeClass: 'magnetic-active'
    };

    document.addEventListener('mousemove', (e) => {
        magneticElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const radius = Math.max(rect.width, rect.height) * 1.5;
            
            if (distance < radius) {
                const force = (1 - distance / radius) * magneticSettings.distance;
                const angle = Math.atan2(deltaY, deltaX);
                const translateX = Math.cos(angle) * force;
                const translateY = Math.sin(angle) * force;
                
                element.style.transform = `translate(${translateX}px, ${translateY}px)`;
                element.classList.add(magneticSettings.activeClass);
            } else {
                element.style.transform = '';
                element.classList.remove(magneticSettings.activeClass);
            }
        });
    });

    
    const style = document.createElement('style');
    style.textContent = `
        .magnetic {
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
            display: inline-block;
        }
        header {
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        header.hidden {
            opacity: 0;
            transform: translateY(-100%);
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
});

document.querySelectorAll('.intro-container img').forEach(img => {
    const hoverSrc = img.dataset.hoverSrc;
    if (!hoverSrc) return;

    
    const preloadImage = new Image();
    preloadImage.src = hoverSrc;

    
    img.dataset.originalSrc = img.src;

    img.addEventListener('mouseenter', () => {
        img.style.opacity = '0'; 
        setTimeout(() => {
            img.src = hoverSrc;
            img.style.opacity = '1'; 
        }, 1); 
    });

    img.addEventListener('mouseleave', () => {
        img.style.opacity = '0';
        setTimeout(() => {
            img.src = img.dataset.originalSrc;
            img.style.opacity = '1';
        }, 1);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const aboutContainer = document.querySelector('.about-container');
    if (!aboutContainer) return;

    const images = aboutContainer.querySelectorAll('img');
    if (images.length < 2) return;

    // Сохраняем оригинальные позиции и текущее смещение
    const imageData = Array.from(images).map(img => {
        const style = window.getComputedStyle(img);
        return {
            element: img,
            originalLeft: parseInt(style.left) || 0,
            currentOffset: 0 // Текущее смещение от оригинальной позиции
        };
    });

    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let startOffset = 0;

    // Функция обновления позиций
    function updatePositions(additionalOffset = 0) {
        imageData.forEach(data => {
            const newLeft = data.originalLeft + data.currentOffset + additionalOffset;
            data.element.style.left = `${newLeft}px`;
        });
    }

    // Обработчики событий
    function handleStart(e) {
        isDragging = true;
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        startOffset = imageData[0].currentOffset; // Сохраняем текущее смещение
        aboutContainer.style.cursor = 'grabbing';
        e.preventDefault();
    }

    function handleMove(e) {
        if (!isDragging) return;
        
        currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const offsetX = currentX - startX;
        
        updatePositions(offsetX);
        e.preventDefault();
    }

    function handleEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        aboutContainer.style.cursor = '';
        
        // Фиксируем новое положение
        const totalOffset = currentX - startX;
        imageData.forEach(data => {
            data.currentOffset += totalOffset;
        });
    }

    // Назначение событий
    aboutContainer.addEventListener('mousedown', handleStart);
    aboutContainer.addEventListener('mousemove', handleMove);
    aboutContainer.addEventListener('mouseup', handleEnd);
    aboutContainer.addEventListener('mouseleave', handleEnd);
    
    aboutContainer.addEventListener('touchstart', handleStart, { passive: false });
    aboutContainer.addEventListener('touchmove', handleMove, { passive: false });
    aboutContainer.addEventListener('touchend', handleEnd, { passive: false });
    
    aboutContainer.addEventListener('contextmenu', e => e.preventDefault());

    // Инициализация
    updatePositions();
});

