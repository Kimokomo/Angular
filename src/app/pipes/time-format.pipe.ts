import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeFormat',
    standalone: true,
})
export class TimeFormatPipe implements PipeTransform {

    // Arrow Function
    transform = (s: number) =>
        Number.isFinite(s) && s >= 0
            ? [Math.floor(s / 60), s % 60].map(n => n.toString().padStart(2, '0')).join(':')
            : '00:00';
}