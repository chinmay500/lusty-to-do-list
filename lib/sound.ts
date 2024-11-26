export const playSound = (action: 'create' | 'edit' | 'delete') => {
    let sound: HTMLAudioElement
  
    switch (action) {
      case 'create':
        sound = new Audio('/create.mp3')
        break
      case 'edit':
        sound = new Audio('/sounds/edit.mp3')
        break
      case 'delete':
        sound = new Audio('/sounds/delete.mp3')
        break
    }
  
    sound.play().catch(error => console.error('Error playing sound:', error))
  }
  
  